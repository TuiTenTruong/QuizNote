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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.PaymentTransaction;
import com.tnntruong.quiznote.domain.Purchase;
import com.tnntruong.quiznote.domain.SellerProfile;
import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.domain.Withdraw;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.dto.response.ResWalletSellerDTO;
import com.tnntruong.quiznote.dto.response.Seller.ResOrderDTO;
import com.tnntruong.quiznote.dto.response.Seller.ResRecentOrderDTO;
import com.tnntruong.quiznote.dto.response.Seller.ResSellerAnalytics;
import com.tnntruong.quiznote.repository.PaymentTransactionRepository;
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.repository.SellerProfileRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.repository.WithdrawRepository;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class SellerService {
	private final UserRepository userRepository;
	private final SubjectRepository subjectRepository;
	private final PurchaseRepository purchaseRepository;
	private final SellerProfileRepository sellerProfileRepository;
	private final WithdrawRepository withdrawRepository;
	private final PaymentTransactionRepository paymentTransactionRepository;

	public SellerService(UserRepository userRepository, SubjectRepository subjectRepository,
			PurchaseRepository purchaseRepository, SellerProfileRepository sellerProfileRepository,
			WithdrawRepository withdrawRepository, PaymentTransactionRepository paymentTransactionRepository) {
		this.userRepository = userRepository;
		this.subjectRepository = subjectRepository;
		this.purchaseRepository = purchaseRepository;
		this.sellerProfileRepository = sellerProfileRepository;
		this.withdrawRepository = withdrawRepository;
		this.paymentTransactionRepository = paymentTransactionRepository;
	}

	public ResSellerAnalytics getSellerAnalytics(long sellerId, Integer months) throws InvalidException {
		User seller = userRepository.findById(sellerId)
				.orElseThrow(() -> new InvalidException("Seller not found"));

		// Get seller profile
		Optional<SellerProfile> profileOpt = sellerProfileRepository.findBySeller(seller);
		SellerProfile profile = profileOpt.orElse(new SellerProfile());

		// Get all subjects by this seller
		List<Subject> subjectsNotDeleted = subjectRepository.findAllBySellerIdNotDeleted(sellerId);

		List<Subject> allSubjects = subjectRepository.findAllBySellerId(sellerId);
		// Get all purchases for seller's subjects
		List<Purchase> allPurchases = new ArrayList<>();
		for (Subject subject : subjectsNotDeleted) {
			allPurchases.addAll(purchaseRepository.findBySubjectId(subject.getId()));
		}

		List<PaymentTransaction> transactions = new ArrayList<>();
		for (Subject subject : allSubjects) {
			List<PaymentTransaction> subjectTransactions = paymentTransactionRepository
					.findBySubjectId(subject.getId());
			transactions.addAll(subjectTransactions);
		}

		// Filter by time range if specified
		List<PaymentTransaction> filteredTransactions = transactions;
		if (months != null && months > 0) {
			Instant cutoffDate = Instant.now().minus(months * 30L, java.time.temporal.ChronoUnit.DAYS);
			filteredTransactions = transactions.stream()
					.filter(p -> p.getCreatedAt() != null
							&& p.getCreatedAt().isAfter(cutoffDate))
					.collect(Collectors.toList());
		}

		// Calculate total revenue from filtered purchases
		long totalRevenue = filteredTransactions.stream()
				.mapToLong(p -> p.getAmount() != null ? p.getAmount().longValue() : 0L)
				.sum();

		// Total quizzes sold
		int totalQuizzesSold = filteredTransactions.size();

		// Total subjects
		int totalSubjects = subjectsNotDeleted.size();

		// Average rating across all subjects
		double averageRating = subjectsNotDeleted.stream()
				.filter(s -> s.getAverageRating() != null && s.getAverageRating() > 0.0)
				.mapToDouble(Subject::getAverageRating)
				.average()
				.orElse(0.0);

		// Total views (using purchase count as a proxy for now)
		int totalViews = subjectsNotDeleted.stream()
				.mapToInt(s -> s.getPurchaseCount() != null ? s.getPurchaseCount() : 0)
				.sum() * 10; // Estimate: 10 views per purchase

		// Top subjects by sales
		Map<Long, Integer> subjectSalesCount = allPurchases.stream()
				.collect(Collectors.groupingBy(
						p -> p.getSubject().getId(),
						Collectors.summingInt(p -> 1)));

		List<ResSellerAnalytics.SubjectStat> topSubjects = subjectsNotDeleted.stream()
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
					Instant purchasedAt = purchase.getPurchasedAt();
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
		Map<YearMonth, List<PaymentTransaction>> monthlyPurchases = filteredTransactions.stream()
				.filter(p -> p.getCreatedAt() != null)
				.collect(Collectors.groupingBy(
						p -> YearMonth.from(LocalDate.ofInstant(p.getCreatedAt(),
								ZoneId.systemDefault())),
						LinkedHashMap::new,
						Collectors.toList()));

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
		List<ResSellerAnalytics.MonthlyRevenue> monthlyRevenue = monthlyPurchases.entrySet().stream()
				.sorted(Map.Entry.<YearMonth, List<PaymentTransaction>>comparingByKey())
				.map(e -> {
					YearMonth month = e.getKey();
					List<PaymentTransaction> purchases = e.getValue();
					long revenue = purchases.stream()
							.mapToLong(p -> p.getAmount() != null ? p.getAmount().longValue() : 0L)
							.sum() * 85 / 100;
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
				profile.getPendingWithdraw() != null ? profile.getPendingWithdraw() : 0L,
				profile.getAvailableBalance() != null ? profile.getAvailableBalance() : 0L,
				totalQuizzesSold,
				totalSubjects,
				averageRating,
				totalViews,
				topSubjects,
				recentOrders,
				monthlyRevenue);
	}

	public ResWalletSellerDTO getWalletSeller(long sellerId) throws InvalidException {
		User seller = userRepository.findById(sellerId).orElseThrow(() -> new InvalidException("Seller not found"));

		SellerProfile profile = sellerProfileRepository.findBySeller(seller)
				.orElseThrow(() -> new InvalidException("Seller profile not found"));

		ResWalletSellerDTO res = new ResWalletSellerDTO();
		res.setSellerId(sellerId);
		res.setAvailableBalance(profile.getAvailableBalance());
		res.setPendingWithdraw(profile.getPendingWithdraw());
		res.setEarnThisMonth(profile.getTotalRevenue());
		res.setTotalEarnings(profile.getTotalRevenue());
		res.setPendingBalance(profile.getPendingBalance());

		List<Withdraw> withdraw = withdrawRepository.findAllBySellerId(seller.getId());
		res.setWithdrawHistories(withdraw.stream().map((w) -> {
			ResWalletSellerDTO.WithdrawHistoryDTO withdrawDTO = new ResWalletSellerDTO.WithdrawHistoryDTO();
			withdrawDTO.setId(w.getId());
			withdrawDTO.setAmount(w.getAmount());
			withdrawDTO.setStatus(w.getStatus().name());
			withdrawDTO.setRequestedAt(w.getRequestedAt());
			withdrawDTO.setProcessedAt(w.getProcessedAt());
			return withdrawDTO;
		}).collect(Collectors.toList()));
		return res;
	}

	public ResResultPagination getOrdersSeller(Long sellerId, Specification<PaymentTransaction> spec, Pageable page)
			throws InvalidException {
		User seller = userRepository.findById(sellerId).orElseThrow(() -> new InvalidException("Seller not found"));
		Specification<PaymentTransaction> finalSpec = (root, query, cb) -> cb.equal(root.get("seller").get("id"),
				sellerId);
		if (spec != null) {
			finalSpec = finalSpec.and(spec);
		}

		Page<PaymentTransaction> transactions = paymentTransactionRepository.findAll(finalSpec, page);
		List<ResOrderDTO> listOrder = transactions.getContent().stream().map(item -> {
			ResOrderDTO res = new ResOrderDTO();
			res.setId(item.getId());
			res.setTransactionNo(item.getTransactionNo());
			res.setAmount(item.getAmount());
			res.setOrderInfo(item.getOrderInfo());
			res.setPaymentMethod(item.getPaymentMethod());
			res.setStatus(item.getStatus());
			res.setPaymentTime(item.getPaymentTime());
			res.setCreatedAt(item.getCreatedAt());

			ResOrderDTO.SellerDTO sellerDTO = new ResOrderDTO.SellerDTO();
			sellerDTO.setId(item.getSeller().getId());
			sellerDTO.setName(item.getSeller().getName());
			res.setSeller(sellerDTO);

			ResOrderDTO.BuyerDTO buyerDTO = new ResOrderDTO.BuyerDTO();
			buyerDTO.setId(item.getBuyer().getId());
			buyerDTO.setName(item.getBuyer().getName());
			res.setBuyer(buyerDTO);

			ResOrderDTO.SubjectDTO subjectDTO = new ResOrderDTO.SubjectDTO();
			subjectDTO.setId(item.getSubject().getId());
			subjectDTO.setName(item.getSubject().getName());
			res.setSubject(subjectDTO);
			return res;
		}).collect(Collectors.toList());
		ResResultPagination result = new ResResultPagination();

		ResResultPagination.Meta mt = new ResResultPagination.Meta();
		mt.setPage(transactions.getNumber() + 1);
		mt.setPageSize(transactions.getSize());
		mt.setPages(transactions.getTotalPages());
		mt.setTotal(transactions.getTotalElements());
		result.setMeta(mt);
		result.setResult(listOrder);
		return result;

	}

	public List<ResRecentOrderDTO> getRecentOrder(Long subjectId) throws InvalidException {
		List<Purchase> purchases = purchaseRepository.findRecentOrdersBySubjectId(subjectId);
		return purchases.stream().map(item -> {
			ResRecentOrderDTO res = new ResRecentOrderDTO();
			res.setId(item.getId());
			res.setBuyer(item.getStudent().getName());
			res.setBuyerEmail(item.getStudent().getEmail());
			res.setPurchaseDate(item.getPurchasedAt());
			return res;
		}).collect(Collectors.toList());
	}
}
