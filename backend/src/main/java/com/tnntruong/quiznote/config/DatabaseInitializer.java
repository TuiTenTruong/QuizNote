package com.tnntruong.quiznote.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Permission;
import com.tnntruong.quiznote.domain.Role;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.repository.PermissionRepository;
import com.tnntruong.quiznote.repository.RoleRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.util.constant.GenderEnum;

@Service
public class DatabaseInitializer implements CommandLineRunner {

        private final PermissionRepository permissionRepository;
        private final RoleRepository roleRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public DatabaseInitializer(PermissionRepository permissionRepository, RoleRepository roleRepository,
                        UserRepository userRepository, PasswordEncoder passwordEncoder) {
                this.permissionRepository = permissionRepository;
                this.roleRepository = roleRepository;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) throws Exception {
                System.out.println(">>> START INIT DATABASE");
                long countPermission = this.permissionRepository.count();
                long countRole = this.roleRepository.count();
                long countUser = this.userRepository.count();

                // Khởi tạo permissions
                if (countPermission == 0) {
                        ArrayList<Permission> arr = new ArrayList<>();

                        // PERMISSIONS module
                        arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
                        arr.add(new Permission("Update a permission", "/api/v1/permissions", "PUT", "PERMISSIONS"));
                        arr.add(new Permission("Delete a permission", "/api/v1/permissions/{id}", "DELETE",
                                        "PERMISSIONS"));
                        arr.add(new Permission("Get a permission by id", "/api/v1/permissions/{id}", "GET",
                                        "PERMISSIONS"));
                        arr.add(new Permission("Get permissions with pagination", "/api/v1/permissions", "GET",
                                        "PERMISSIONS"));

                        // ROLES module
                        arr.add(new Permission("Create a role", "/api/v1/roles", "POST", "ROLES"));
                        arr.add(new Permission("Update a role", "/api/v1/roles", "PUT", "ROLES"));
                        arr.add(new Permission("Delete a role", "/api/v1/roles/{id}", "DELETE", "ROLES"));
                        arr.add(new Permission("Get a role by id", "/api/v1/roles/{id}", "GET", "ROLES"));
                        arr.add(new Permission("Get roles with pagination", "/api/v1/roles", "GET", "ROLES"));

                        // USERS module
                        arr.add(new Permission("Create a user", "/api/v1/users", "POST", "USERS"));
                        arr.add(new Permission("Update a user", "/api/v1/users", "PUT", "USERS"));
                        arr.add(new Permission("Delete a user", "/api/v1/users/{id}", "DELETE", "USERS"));
                        arr.add(new Permission("Get a user by id", "/api/v1/users/{id}", "GET", "USERS"));
                        arr.add(new Permission("Get users with pagination", "/api/v1/users", "GET", "USERS"));

                        // Skip ID 16, 17 (không có trong SQL)
                        arr.add(new Permission("Delete a subject", "/api/v1/subjects/{id}", "DELETE", "SUBJECTS"));

                        // SUBJECTS module
                        arr.add(new Permission("Get a subject by id", "/api/v1/subjects/{id}", "GET", "SUBJECTS"));
                        arr.add(new Permission("Get subjects with pagination", "/api/v1/subjects", "GET", "SUBJECTS"));
                        arr.add(new Permission("Create a subject", "/api/v1/subjects", "POST", "SUBJECTS"));
                        arr.add(new Permission("Update a subject", "/api/v1/subjects", "PUT", "SUBJECTS"));
                        arr.add(new Permission("Delete a subject", "/api/v1/subjects/{id}", "DELETE", "SUBJECTS"));
                        arr.add(new Permission("Get a subject by id", "/api/v1/subjects/{id}", "GET", "SUBJECTS"));
                        arr.add(new Permission("Get subjects with pagination", "/api/v1/subjects", "GET", "SUBJECTS"));

                        // PURCHASES module
                        arr.add(new Permission("Create a purchase", "/api/v1/purchases", "POST", "PURCHASES"));
                        arr.add(new Permission("Get a purchase by userId", "/api/v1/purchases/user/{userId}", "GET",
                                        "PURCHASES"));
                        arr.add(new Permission("Delete a purchase", "/api/v1/purchases/{id}", "DELETE", "PURCHASES"));
                        arr.add(new Permission("Get a purchase by id", "/api/v1/purchases/{id}", "GET", "PURCHASES"));
                        arr.add(new Permission("Get purchases by subjectId", "/api/v1/purchases/subject/{subjectId}",
                                        "GET",
                                        "PURCHASES"));

                        // QUESTIONS module
                        arr.add(new Permission("Create a question", "/api/v1/questions", "POST", "QUESTIONS"));
                        arr.add(new Permission("Update a question", "/api/v1/questions", "PUT", "QUESTIONS"));
                        arr.add(new Permission("Delete a question", "/api/v1/questions/{id}", "DELETE", "QUESTIONS"));
                        arr.add(new Permission("Get a question by id", "/api/v1/questions/{id}", "GET", "QUESTIONS"));
                        arr.add(new Permission("Get questions by subjectId", "/api/v1/questions/subject/{subjectId}",
                                        "GET",
                                        "QUESTIONS"));

                        // CHAPTERS module
                        arr.add(new Permission("Create a chapter", "/api/v1/chapters", "POST", "CHAPTERS"));
                        arr.add(new Permission("Update a chapter", "/api/v1/chapters", "PUT", "CHAPTERS"));
                        arr.add(new Permission("Delete a chapter", "/api/v1/chapters/{id}", "DELETE", "CHAPTERS"));
                        arr.add(new Permission("Get a chapter by id", "/api/v1/chapters/{id}", "GET", "CHAPTERS"));
                        arr.add(new Permission("Get chapters by subjectId", "/api/v1/chapters/subject/{subjectId}",
                                        "GET",
                                        "CHAPTERS"));

                        // FILES module
                        arr.add(new Permission("Download a file", "/api/v1/files", "GET", "FILES"));
                        arr.add(new Permission("Upload a file", "/api/v1/files", "POST", "FILES"));

                        // USER module
                        arr.add(new Permission("upload avatar", "/api/v1/users/{email}/avatar", "POST", "USER"));

                        // COMMENTS module
                        arr.add(new Permission("create comment", "/api/v1/comments/{subjectId}", "POST", "COMMENTS"));
                        arr.add(new Permission("reply comment", "/api/v1/comments/reply/{parentId}", "POST",
                                        "COMMENTS"));
                        arr.add(new Permission("get by subjectId comment", "/api/v1/comments/subject/{subjectId}",
                                        "GET",
                                        "COMMENTS"));
                        arr.add(new Permission("delete comment", "/api/v1/comments/{commentId}", "DELETE", "COMMENTS"));

                        // SUBMISSIONS module
                        arr.add(new Permission("start submission", "/api/v1/submissions/start", "POST", "SUBMISISONS"));
                        arr.add(new Permission("submit submission", "/api/v1/submissions/{submissionId}/submit", "POST",
                                        "SUBMISISONS"));
                        arr.add(new Permission("get question random", "/api/v1/questions/subject/{subjectId}/random",
                                        "GET",
                                        "QUESTIONS"));
                        arr.add(new Permission("get submissions history", "/api/v1/submissions/history/user/{userId}",
                                        "GET",
                                        "SUBMISISONS"));
                        arr.add(new Permission("get analytics by userId", "/api/v1/submissions/analytics/user/{userId}",
                                        "GET",
                                        "SUBMISISONS"));

                        // PAYMENTS module
                        arr.add(new Permission("submit order", "/api/v1/payments/vnpay/submitOrder", "POST",
                                        "PAYMENTS"));
                        arr.add(new Permission("handle payment", "/api/v1/payments/vnpay/vnpay-payment", "GET",
                                        "PAYMENTS"));

                        // SUBJECTS & SELLERS modules
                        arr.add(new Permission("get subject by seller id", "/api/v1/subjects/seller/{sellerId}", "GET",
                                        "SUBJECTS"));
                        arr.add(new Permission("get order by seller id", "/api/v1/seller/orders/{sellerId}", "GET",
                                        "SELLERS"));
                        arr.add(new Permission("get wallet by seller id", "/api/v1/seller/wallet/{sellerId}", "GET",
                                        "SELLERS"));
                        arr.add(new Permission("withdraw", "/api/v1/withdraw", "POST", "WITHDRAWS"));

                        // More USERS permissions
                        arr.add(new Permission("update user profile", "/api/v1/users/profile", "PUT", "USERS"));
                        arr.add(new Permission("update user password", "/api/v1/users/change-password", "POST",
                                        "USERS"));
                        arr.add(new Permission("update user preferences", "/api/v1/users/preferences", "PUT", "USERS"));
                        arr.add(new Permission("get user proofile", "/api/v1/users/me", "GET", "USERS"));

                        // ADMINS module
                        arr.add(new Permission("get admin analysis", "/api/v1/admin/analysis", "GET", "ADMINS"));
                        arr.add(new Permission("change status user", "/api/v1/users/changeStatus", "POST", "ADMINS"));
                        arr.add(new Permission("approve subject", "api/v1/subjects/{subjectId}/approve", "PUT",
                                        "SUBJECTS"));
                        arr.add(new Permission("reject subject", "api/v1/subjects/{subjectId}/reject", "PUT",
                                        "SUBJECTS"));
                        arr.add(new Permission("Get demo subjects", "/api/v1/subjects/demo", "GET", "SUBJECTS"));
                        arr.add(new Permission("create draft subject", "/api/v1/subjects/draft", "POST", "SUBJECTS"));
                        arr.add(new Permission("set failed payments", "/api/v1/payments/vnpay/failedPayment", "POST",
                                        "PAYMENTS"));
                        arr.add(new Permission("get order by admin", "/api/v1/admin/orders", "GET", "ADMINS"));
                        arr.add(new Permission("get recent order by order id", "/api/v1/seller/recentOrder/{subjectId}",
                                        "GET",
                                        "SELLERS"));
                        arr.add(new Permission("get my rating", "/api/v1/comments/user/{userId}", "GET", "USERS"));

                        // WEEKLY_QUIZZES module
                        arr.add(new Permission("create weekly quizzes", "/api/v1/admin/weekly-quizzes", "POST",
                                        "WEEKLY_QUIZZES"));
                        arr.add(new Permission("update weekly quizzes by quizId", "/api/v1/admin/weekly-quizzes/{id}",
                                        "PUT",
                                        "WEEKLY_QUIZZES"));
                        arr.add(new Permission("Delete weekly quiz by quizId", "/api/v1/admin/weekly-quizzes/{id}",
                                        "DELETE",
                                        "WEEKLY_QUIZZES"));
                        arr.add(new Permission("get all weekly quiz", "/api/v1/admin/weekly-quizzes", "GET",
                                        "WEEKLY_QUIZZES"));
                        arr.add(new Permission("get weekly quiz detail", "/api/v1/admin/weekly-quizzes/{id}", "GET",
                                        "WEEKLY_QUIZZES"));
                        arr.add(new Permission("get current weekly quiz", "/api/v1/weekly-quiz/current", "GET",
                                        "WEEKLY_QUIZZES"));
                        arr.add(new Permission("get weekly quiz status", "/api/v1/weekly-quiz/{id}/status", "GET",
                                        "WEEKLY_QUIZZES"));
                        arr.add(new Permission("submit weekly quiz ", "/api/v1/weekly-quiz/submit", "POST",
                                        "WEEKLY_QUIZZES"));

                        // REWARDS module
                        arr.add(new Permission("get Available Rewards", "/api/v1/rewards/available", "GET", "REWARDS"));
                        arr.add(new Permission("redeem Reward", "/api/v1/rewards/redeem", "POST", "REWARDS"));
                        arr.add(new Permission("get My Transactions", "/api/v1/rewards/my-transactions", "GET",
                                        "REWARDS"));
                        arr.add(new Permission("create Reward", "/api/v1/rewards", "POST", "REWARDS"));
                        arr.add(new Permission("update Reward", "/api/v1/rewards/{id}", "PUT", "REWARDS"));
                        arr.add(new Permission("delete Reward", "/api/v1/rewards/{id}", "DELETE", "REWARDS"));
                        arr.add(new Permission("get All Rewards", "/api/v1/rewards", "GET", "REWARDS"));
                        arr.add(new Permission("get Reward By Id", "/api/v1/rewards/{id}", "GET", "REWARDS"));
                        arr.add(new Permission("get All Transactions", "/api/v1/rewards/transactions", "GET",
                                        "REWARDS"));
                        arr.add(new Permission("update Transaction Status", "/api/v1/rewards/transactions/{id}/status",
                                        "PUT",
                                        "REWARDS"));

                        this.permissionRepository.saveAll(arr);
                }

                // Khởi tạo roles với permissions tương ứng
                if (countRole == 0) {
                        List<Permission> allPermissions = this.permissionRepository.findAll();

                        // 1. SUPER_ADMIN Role - có tất cả permissions
                        Role adminRole = new Role();
                        adminRole.setName("SUPER_ADMIN");
                        adminRole.setDescription("Admin thì full permission");
                        adminRole.setActive(true);
                        adminRole.setPermissions(allPermissions);
                        this.roleRepository.save(adminRole);

                        // 2. STUDENT Role - có permissions theo mapping trong SQL
                        // Permission IDs cho STUDENT (role_id = 2):
                        // 9,10,14,15,19,20,21,24,25,26,27,29,30,34,41,43,44,46,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,67,68,69,72,78,79,80,81,82,83
                        List<Long> studentPermissionIds = Arrays.asList(
                                        9L, 10L, 14L, 15L, 19L, 20L, 21L, 24L, 25L, 26L, 27L, 29L, 30L, 34L, 41L, 43L,
                                        44L, 46L,
                                        48L, 49L, 50L, 51L, 52L, 53L, 54L, 55L, 56L, 57L, 58L, 59L, 60L, 61L, 62L, 67L,
                                        68L, 69L, 72L,
                                        78L, 79L, 80L, 81L, 82L, 83L);
                        List<Permission> studentPermissions = allPermissions.stream()
                                        .filter(p -> studentPermissionIds.contains(p.getId()))
                                        .collect(Collectors.toList());

                        Role studentRole = new Role();
                        studentRole.setName("STUDENT");
                        studentRole.setDescription("Default regular user with read permissions");
                        studentRole.setActive(true);
                        studentRole.setPermissions(studentPermissions);
                        this.roleRepository.save(studentRole);

                        // 3. SELLER Role - có permissions theo mapping trong SQL
                        // Permission IDs cho SELLER (role_id = 4):
                        // 19,20,21,22,23,24,25,27,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,55,56,57,58,59,60,62,67,68,71
                        List<Long> sellerPermissionIds = Arrays.asList(
                                        19L, 20L, 21L, 22L, 23L, 24L, 25L, 27L, 29L, 30L, 31L, 32L, 33L, 34L, 35L, 36L,
                                        37L, 38L, 39L, 40L,
                                        41L, 42L, 43L, 44L, 45L, 46L, 47L, 55L, 56L, 57L, 58L, 59L, 60L, 62L, 67L, 68L,
                                        71L);
                        List<Permission> sellerPermissions = allPermissions.stream()
                                        .filter(p -> sellerPermissionIds.contains(p.getId()))
                                        .collect(Collectors.toList());

                        Role sellerRole = new Role();
                        sellerRole.setName("SELLER");
                        sellerRole.setDescription("đây là vai trò dành cho người bán trắc nghiệm");
                        sellerRole.setActive(true);
                        sellerRole.setPermissions(sellerPermissions);
                        this.roleRepository.save(sellerRole);
                }

                // Khởi tạo users
                if (countUser == 0) {
                        // Tạo admin user
                        User adminUser = new User();
                        adminUser.setEmail("admin@gmail.com");
                        adminUser.setAddress("hn");
                        adminUser.setAge(25);
                        adminUser.setGender(GenderEnum.MALE);
                        adminUser.setName("I'm super admin");
                        adminUser.setPassword(this.passwordEncoder.encode("123456"));
                        Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
                        if (adminRole != null) {
                                adminUser.setRole(adminRole);
                        }
                        this.userRepository.save(adminUser);

                        // Tạo student user
                        User studentUser = new User();
                        studentUser.setEmail("student@gmail.com");
                        studentUser.setAddress("hn");
                        studentUser.setAge(22);
                        studentUser.setGender(GenderEnum.FEMALE);
                        studentUser.setName("Student User");
                        studentUser.setPassword(this.passwordEncoder.encode("123456"));
                        Role studentRole = this.roleRepository.findByName("STUDENT");
                        if (studentRole != null) {
                                studentUser.setRole(studentRole);
                        }
                        this.userRepository.save(studentUser);

                        // Tạo seller user
                        User sellerUser = new User();
                        sellerUser.setEmail("seller@gmail.com");
                        sellerUser.setAddress("hcm");
                        sellerUser.setAge(30);
                        sellerUser.setGender(GenderEnum.MALE);
                        sellerUser.setName("Seller User");
                        sellerUser.setPassword(this.passwordEncoder.encode("123456"));
                        Role sellerRole = this.roleRepository.findByName("SELLER");
                        if (sellerRole != null) {
                                sellerUser.setRole(sellerRole);
                        }
                        this.userRepository.save(sellerUser);
                }

                if (countPermission > 0 && countRole > 0 && countUser > 0) {
                        System.out.println(">>> SKIP INIT DATABASE ~ ALREADY HAS DATA");
                } else {
                        System.out.println(">>> END INIT DATABASE");
                }
        }
}
