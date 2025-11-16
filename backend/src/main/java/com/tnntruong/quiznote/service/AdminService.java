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

import com.tnntruong.quiznote.dto.response.admin.ResAdminAnalyticsDTO;
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.UserRepository;

@Service
public class AdminService {

        private final SubjectRepository subjectRepository;
        private final UserRepository userRepository;
        private final PurchaseRepository purchaseRepository;

        public AdminService(SubjectRepository subjectRepository, UserRepository userRepository,
                        PurchaseRepository purchaseRepository) {
                this.subjectRepository = subjectRepository;
                this.userRepository = userRepository;
                this.purchaseRepository = purchaseRepository;
        }

        public ResAdminAnalyticsDTO getAdminAnalytics() {
                ResAdminAnalyticsDTO analytics = new ResAdminAnalyticsDTO();

                // get total users and change in last month
                long totalUsers = userRepository.count();
                Instant oneMonthAgo = Instant.now().minus(30, java.time.temporal.ChronoUnit.DAYS);
                long usersLastMonth = userRepository.countUsersRegisteredAfter(oneMonthAgo);
                long previousUsers = totalUsers - usersLastMonth;
                double userChange = previousUsers == 0 ? (usersLastMonth > 0 ? 100.0 : 0.0)
                                : ((double) usersLastMonth / previousUsers) * 100;
                ResAdminAnalyticsDTO.StatusCard userStatus = new ResAdminAnalyticsDTO.StatusCard();
                userStatus.setTitle("Total Users");
                userStatus.setValue(totalUsers);
                userStatus.setChange(userChange);
                analytics.setStatusCards(new ArrayList<>());
                analytics.getStatusCards().add(userStatus);

                // get total subjects and change in last month
                long totalSubjects = subjectRepository.count();
                long subjectsLastMonth = subjectRepository.countSubjectsCreatedAfter(oneMonthAgo);
                long previousSubjects = totalSubjects - subjectsLastMonth;
                double subjectChange = previousSubjects == 0 ? (subjectsLastMonth > 0 ? 100.0 : 0.0)
                                : ((double) subjectsLastMonth / previousSubjects) * 100;
                ResAdminAnalyticsDTO.StatusCard subjectStatus = new ResAdminAnalyticsDTO.StatusCard();
                subjectStatus.setTitle("Total Subjects");
                subjectStatus.setValue(totalSubjects);
                subjectStatus.setChange(subjectChange);
                analytics.getStatusCards().add(subjectStatus);

                // get total revenue and change in last month
                Double totalRevenue = purchaseRepository.sumAllPurchaseAmount();
                Double revenueLastMonth = purchaseRepository.sumPurchaseAmountAfter(oneMonthAgo);
                Double previousRevenue = totalRevenue - revenueLastMonth;
                double revenueChange = previousRevenue == 0 ? (revenueLastMonth > 0 ? 100.0 : 0.0)
                                : (revenueLastMonth / previousRevenue) * 100;
                ResAdminAnalyticsDTO.StatusCard revenueStatus = new ResAdminAnalyticsDTO.StatusCard();
                revenueStatus.setTitle("Total Revenue");
                revenueStatus.setValue(totalRevenue.longValue());
                revenueStatus.setChange(revenueChange);
                analytics.getStatusCards().add(revenueStatus);

                // get total order and change in last month
                long totalOrders = purchaseRepository.count();
                long ordersLastMonth = purchaseRepository.countPurchaseAfter(oneMonthAgo);
                long previousOrders = totalOrders - ordersLastMonth;
                double orderChange = previousOrders == 0 ? (ordersLastMonth > 0 ? 100.0 : 0.0)
                                : ((double) ordersLastMonth / previousOrders) * 100;
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
                        Double revenue = purchaseRepository.sumPurchaseAmountByMonth(ym.getYear(), ym.getMonthValue());

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
}
