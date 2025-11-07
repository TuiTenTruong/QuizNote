package com.tnntruong.quiznote.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Purchase;
import com.tnntruong.quiznote.domain.SellerProfile;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.response.Seller.ResSellerAnalytics;
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.repository.SellerProfileRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class SellerService {
	private final UserRepository userRepository;
	private final SubjectRepository subjectRepository;
	private final PurchaseRepository purchaseRepository;
	private final SellerProfileRepository sellerProfileRepository;

	public SellerService(UserRepository userRepository, SubjectRepository subjectRepository,
			PurchaseRepository purchaseRepository, SellerProfileRepository sellerProfileRepository) {
		this.userRepository = userRepository;
		this.subjectRepository = subjectRepository;
		this.purchaseRepository = purchaseRepository;
		this.sellerProfileRepository = sellerProfileRepository;
	}

	public ResSellerAnalytics getSellerAnalytics(long sellerId, Integer months) throws InvalidException {
		User seller = userRepository.findById(sellerId)
				.orElseThrow(() -> new InvalidException("Seller not found"));

		// Get seller profile
		Optional<SellerProfile> profileOpt = sellerProfileRepository.findByUser(seller);
		SellerProfile profile = profileOpt.orElse(new SellerProfile());

		// Get all subjects by this seller
		List<Subject> subjects = subjectRepository.findAll().stream()
				.filter(s -> s.getSeller() != null && s.getSeller().getId() == sellerId)
				.collect(Collectors.toList());

		// Get all purchases for seller's subjects
		List<Purchase> allPurchases = new ArrayList<>();
		for (Subject subject : subjects) {
			allPurchases.addAll(purchaseRepository.findBySubjectId(subject.getId()));
		}

		// Filter by time range if specified
		List<Purchase> filteredPurchases = allPurchases;
		if (months != null && months > 0) {
			Instant cutoffDate = Instant.now().minus(months * 30L, java.time.temporal.ChronoUnit.DAYS);
			filteredPurchases = allPurchases.stream()
					.filter(p -> p.getPurchasedAt() != null
							&& p.getPurchasedAt().isAfter(cutoffDate))
					.collect(Collectors.toList());
		}

		// Calculate total revenue from filtered purchases
		long totalRevenue = filteredPurchases.stream()
				.mapToLong(p -> (long) p.getSubject().getPrice())
				.sum();

		// Total quizzes sold
		int totalQuizzesSold = filteredPurchases.size();

		// Total subjects
		int totalSubjects = subjects.size();

		// Average rating across all subjects
		double averageRating = subjects.stream()
				.filter(s -> s.getAverageRating() != null)
				.mapToDouble(Subject::getAverageRating)
				.average()
				.orElse(0.0);

		// Total views (using purchase count as a proxy for now)
		int totalViews = subjects.stream()
				.mapToInt(s -> s.getPurchaseCount() != null ? s.getPurchaseCount() : 0)
				.sum() * 10; // Estimate: 10 views per purchase

		// Top subjects by sales
		Map<Long, Integer> subjectSalesCount = allPurchases.stream()
				.collect(Collectors.groupingBy(
						p -> p.getSubject().getId(),
						Collectors.summingInt(p -> 1)));

		List<ResSellerAnalytics.SubjectStat> topSubjects = subjects.stream()
				.map(subject -> {
					int salesCount = subjectSalesCount.getOrDefault(subject.getId(), 0);
					return new ResSellerAnalytics.SubjectStat(
							subject.getId(),
							subject.getName(),
							subject.getPrice(),
							salesCount,
							subject.getAverageRating() != null ? subject.getAverageRating()
									: 0.0,
							subject.getRatingCount() != null ? subject.getRatingCount()
									: 0);
				})
				.sorted((a, b) -> b.getSalesCount().compareTo(a.getSalesCount()))
				.limit(10)
				.collect(Collectors.toList());

		// Recent orders
		List<ResSellerAnalytics.RecentOrder> recentOrders = allPurchases.stream()
				.sorted((a, b) -> b.getPurchasedAt().compareTo(a.getPurchasedAt()))
				.limit(20)
				.map(purchase -> {
					String buyerName = purchase.getStudent().getName();
					String subjectName = purchase.getSubject().getName();
					Double price = purchase.getSubject().getPrice();
					String purchasedAt = purchase.getPurchasedAt().toString();
					String status = "Completed"; // Default status
					return new ResSellerAnalytics.RecentOrder(
							purchase.getId(),
							buyerName,
							subjectName,
							price,
							purchasedAt,
							status);
				})
				.collect(Collectors.toList());

		// Monthly revenue (last 6 months)
		Map<YearMonth, List<Purchase>> monthlyPurchases = filteredPurchases.stream()
				.filter(p -> p.getPurchasedAt() != null)
				.collect(Collectors.groupingBy(
						p -> YearMonth.from(LocalDate.ofInstant(p.getPurchasedAt(),
								ZoneId.systemDefault())),
						LinkedHashMap::new,
						Collectors.toList()));

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
		List<ResSellerAnalytics.MonthlyRevenue> monthlyRevenue = monthlyPurchases.entrySet().stream()
				.sorted(Map.Entry.<YearMonth, List<Purchase>>comparingByKey())
				.map(e -> {
					YearMonth month = e.getKey();
					List<Purchase> purchases = e.getValue();
					long revenue = purchases.stream()
							.mapToLong(p -> (long) p.getSubject().getPrice())
							.sum();
					int salesCount = purchases.size();
					String monthName = month.atDay(1).format(formatter);
					return new ResSellerAnalytics.MonthlyRevenue(monthName, revenue, salesCount);
				})
				.collect(Collectors.toList());

		// If no monthly data, create empty entries for last 6 months
		if (monthlyRevenue.isEmpty()) {
			YearMonth now = YearMonth.now();
			for (int i = 5; i >= 0; i--) {
				YearMonth month = now.minusMonths(i);
				String monthName = month.atDay(1).format(formatter);
				monthlyRevenue.add(new ResSellerAnalytics.MonthlyRevenue(monthName, 0L, 0));
			}
		}

		return new ResSellerAnalytics(
				profile.getTotalRevenue() != null ? profile.getTotalRevenue() : totalRevenue,
				profile.getPendingBalance() != null ? profile.getPendingBalance() : 0L,
				profile.getAvailableBalance() != null ? profile.getAvailableBalance() : 0L,
				totalQuizzesSold,
				totalSubjects,
				averageRating,
				totalViews,
				topSubjects,
				recentOrders,
				monthlyRevenue);
	}
}
