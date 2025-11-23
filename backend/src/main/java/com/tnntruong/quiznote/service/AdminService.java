package com.tnntruong.quiznote.service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.PaymentTransaction;
import com.tnntruong.quiznote.dto.response.Seller.ResOrderDTO;
import com.tnntruong.quiznote.dto.response.admin.ResAdminAnalyticsDTO;
import com.tnntruong.quiznote.dto.response.admin.ResAdminOrderDTO;
import com.tnntruong.quiznote.repository.PaymentTransactionRepository;
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.UserRepository;

@Service
public class AdminService {

        private final SubjectRepository subjectRepository;
        private final UserRepository userRepository;
        private final PaymentTransactionRepository paymentTransactionRepository;

        public AdminService(SubjectRepository subjectRepository, UserRepository userRepository,
                        PaymentTransactionRepository paymentTransactionRepository) {
                this.subjectRepository = subjectRepository;
                this.userRepository = userRepository;
                this.paymentTransactionRepository = paymentTransactionRepository;
        }

        public ResAdminAnalyticsDTO getAdminAnalytics() {
                ResAdminAnalyticsDTO analytics = new ResAdminAnalyticsDTO();

                // get total users and change in last month
                long totalUsers = userRepository.count();
                Instant oneMonthAgo = Instant.now().minus(30, java.time.temporal.ChronoUnit.DAYS);
                long usersLastMonth = userRepository.countUsersRegisteredAfter(oneMonthAgo);
                long increasedUsers = totalUsers - usersLastMonth;
                double userChange = usersLastMonth == 0 ? 0.0
                                : ((double) increasedUsers / usersLastMonth) * 100;
                ResAdminAnalyticsDTO.StatusCard userStatus = new ResAdminAnalyticsDTO.StatusCard();
                userStatus.setTitle("Total Users");
                userStatus.setValue(totalUsers);
                userStatus.setChange(userChange);
                analytics.setStatusCards(new ArrayList<>());
                analytics.getStatusCards().add(userStatus);

                // get total subjects and change in last month
                long totalSubjects = subjectRepository.count();
                long subjectsLastMonth = subjectRepository.countSubjectsCreatedAfter(oneMonthAgo);
                long increasedSubjects = totalSubjects - subjectsLastMonth;

                double subjectChange = subjectsLastMonth == 0 ? 0.0
                                : ((double) increasedSubjects / subjectsLastMonth) * 100;
                ResAdminAnalyticsDTO.StatusCard subjectStatus = new ResAdminAnalyticsDTO.StatusCard();
                subjectStatus.setTitle("Total Subjects");
                subjectStatus.setValue(totalSubjects);
                subjectStatus.setChange(subjectChange);
                analytics.getStatusCards().add(subjectStatus);

                // get total revenue and change in last month
                Double totalRevenue = paymentTransactionRepository.sumAllPurchaseAmount();
                Double revenueLastMonth = paymentTransactionRepository.sumPurchaseAmountAfter(oneMonthAgo);
                Double increasedRevenue = totalRevenue - revenueLastMonth;
                double revenueChange = revenueLastMonth == 0 ? 0.0
                                : (increasedRevenue / revenueLastMonth) * 100;
                ResAdminAnalyticsDTO.StatusCard revenueStatus = new ResAdminAnalyticsDTO.StatusCard();
                revenueStatus.setTitle("Total Revenue");
                revenueStatus.setValue(totalRevenue.longValue());
                revenueStatus.setChange(revenueChange);
                analytics.getStatusCards().add(revenueStatus);

                // get total order and change in last month
                long totalOrders = paymentTransactionRepository.count();
                long ordersLastMonth = paymentTransactionRepository.countByCreatedAtAfter(oneMonthAgo);
                long increasedOrders = totalOrders - ordersLastMonth;
                double orderChange = ordersLastMonth == 0 ? 0
                                : ((double) increasedOrders / ordersLastMonth) * 100;
                ResAdminAnalyticsDTO.StatusCard orderStatus = new ResAdminAnalyticsDTO.StatusCard();
                orderStatus.setTitle("Total Orders");
                orderStatus.setValue(totalOrders);
                orderStatus.setChange(orderChange);
                analytics.getStatusCards().add(orderStatus);

                // get monthly revenue
                List<ResAdminAnalyticsDTO.MonthlyRevenue> monthlyRevenues = new ArrayList<>();
                YearMonth currentYearMonth = YearMonth.now();
                DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");

                for (int i = 0; i < 12; i++) {
                        YearMonth ym = currentYearMonth.minusMonths(i);
                        Double revenue = paymentTransactionRepository.sumPurchaseAmountByMonth(ym.getYear(),
                                        ym.getMonthValue());

                        ResAdminAnalyticsDTO.MonthlyRevenue monthlyRevenue = new ResAdminAnalyticsDTO.MonthlyRevenue();
                        monthlyRevenue.setMonth(ym.format(monthFormatter));
                        monthlyRevenue.setRevenue(revenue != null ? revenue : 0.0);
                        monthlyRevenues.add(monthlyRevenue);
                }
                Collections.reverse(monthlyRevenues);
                analytics.setMonthlyRevenues(monthlyRevenues);

                // get user role counts
                List<ResAdminAnalyticsDTO.UserRoleCount> userRoleCounts = new ArrayList<>();
                List<Object[]> roleCounts = userRepository.countUsersByRole();
                for (Object[] rc : roleCounts) {
                        ResAdminAnalyticsDTO.UserRoleCount userRoleCount = new ResAdminAnalyticsDTO.UserRoleCount();
                        userRoleCount.setRole((String) rc[0]);
                        userRoleCount.setCount((Long) rc[1]);
                        userRoleCounts.add(userRoleCount);
                }
                analytics.setUserRoleCounts(userRoleCounts);

                // get current users - latest 5 users
                List<ResAdminAnalyticsDTO.CurrentUsers> currentUsers = new ArrayList<>();
                userRepository.findAll(PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                                .forEach(user -> {
                                        ResAdminAnalyticsDTO.CurrentUsers currentUser = new ResAdminAnalyticsDTO.CurrentUsers();
                                        currentUser.setName(user.getName());
                                        currentUser.setEmail(user.getEmail());
                                        currentUser.setRole(user.getRole().getName());
                                        currentUser.setStatus(user.isActive() ? "Active" : "Inactive");
                                        currentUser.setJoinDate(user.getCreatedAt().toString());
                                        currentUsers.add(currentUser);
                                });
                analytics.setCurrentUsers(currentUsers);

                return analytics;
        }

        public ResAdminOrderDTO getAllOrders() {

                List<ResOrderDTO> orders = new ArrayList<>();
                List<PaymentTransaction> transactions = paymentTransactionRepository
                                .findAll(Sort.by("createdAt").descending());
                for (PaymentTransaction item : transactions) {
                        ResOrderDTO res = new ResOrderDTO();
                        res.setId(item.getId());
                        res.setTransactionNo(item.getTransactionNo());
                        res.setAmount(item.getAmount());
                        res.setOrderInfo(item.getOrderInfo());
                        res.setPaymentMethod(item.getPaymentMethod());
                        res.setPaymentTime(item.getPaymentTime());
                        res.setStatus(item.getStatus());
                        res.setCreatedAt(item.getCreatedAt());

                        ResOrderDTO.SellerDTO sellerDTO = new ResOrderDTO.SellerDTO();
                        sellerDTO.setId(item.getSeller().getId());
                        sellerDTO.setName(item.getSeller().getName());
                        sellerDTO.setEmail(item.getSeller().getEmail());
                        res.setSeller(sellerDTO);

                        ResOrderDTO.BuyerDTO buyerDTO = new ResOrderDTO.BuyerDTO();
                        buyerDTO.setId(item.getBuyer().getId());
                        buyerDTO.setName(item.getBuyer().getName());
                        buyerDTO.setEmail(item.getBuyer().getEmail());
                        res.setBuyer(buyerDTO);

                        ResOrderDTO.SubjectDTO subjectDTO = new ResOrderDTO.SubjectDTO();
                        subjectDTO.setId(item.getSubject().getId());
                        subjectDTO.setName(item.getSubject().getName());
                        res.setSubject(subjectDTO);

                        orders.add(res);
                }
                ResAdminOrderDTO res = new ResAdminOrderDTO();
                res.setOrders(orders);
                res.setTotalOrders(orders.size());
                res.setSuccessfulOrders(
                                (int) transactions.stream().filter(t -> t.getStatus().equals("SUCCESS")).count());
                res.setTotalRevenue(transactions.stream().mapToLong(PaymentTransaction::getAmount).sum());
                res.setPlatformFee(res.getTotalRevenue() * 15 / 100);

                return res;
        }
}
