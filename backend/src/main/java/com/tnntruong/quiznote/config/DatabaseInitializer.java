package com.tnntruong.quiznote.config;

import java.util.ArrayList;
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

        if (countPermission == 0) {
            ArrayList<Permission> arr = new ArrayList<>();
            arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
            arr.add(new Permission("Update a permission", "/api/v1/permissions", "PUT", "PERMISSIONS"));
            arr.add(new Permission("Delete a permission", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
            arr.add(new Permission("Get a permission by id", "/api/v1/permissions/{id}", "GET", "PERMISSIONS"));
            arr.add(new Permission("Get permissions with pagination", "/api/v1/permissions", "GET", "PERMISSIONS"));

            arr.add(new Permission("Create a role", "/api/v1/roles", "POST", "ROLES"));
            arr.add(new Permission("Update a role", "/api/v1/roles", "PUT", "ROLES"));
            arr.add(new Permission("Delete a role", "/api/v1/roles/{id}", "DELETE", "ROLES"));
            arr.add(new Permission("Get a role by id", "/api/v1/roles/{id}", "GET", "ROLES"));
            arr.add(new Permission("Get roles with pagination", "/api/v1/roles", "GET", "ROLES"));

            arr.add(new Permission("Create a user", "/api/v1/users", "POST", "USERS"));
            arr.add(new Permission("Update a user", "/api/v1/users", "PUT", "USERS"));
            arr.add(new Permission("Delete a user", "/api/v1/users/{id}", "DELETE", "USERS"));
            arr.add(new Permission("Get a user by id", "/api/v1/users/{id}", "GET", "USERS"));
            arr.add(new Permission("Get users with pagination", "/api/v1/users", "GET", "USERS"));

            arr.add(new Permission("Create a subject", "/api/v1/subjects", "POST", "SUBJECTS"));
            arr.add(new Permission("Update a subject", "/api/v1/subjects", "PUT", "SUBJECTS"));
            arr.add(new Permission("Delete a subject", "/api/v1/subjects/{id}", "DELETE", "SUBJECTS"));
            arr.add(new Permission("Get a subject by id", "/api/v1/subjects/{id}", "GET", "SUBJECTS"));
            arr.add(new Permission("Get subjects with pagination", "/api/v1/subjects", "GET", "SUBJECTS"));

            arr.add(new Permission("Create a subject", "/api/v1/subjects", "POST", "SUBJECTS"));
            arr.add(new Permission("Update a subject", "/api/v1/subjects", "PUT", "SUBJECTS"));
            arr.add(new Permission("Delete a subject", "/api/v1/subjects/{id}", "DELETE", "SUBJECTS"));
            arr.add(new Permission("Get a subject by id", "/api/v1/subjects/{id}", "GET", "SUBJECTS"));
            arr.add(new Permission("Get subjects with pagination", "/api/v1/subjects", "GET", "SUBJECTS"));

            arr.add(new Permission("Create a purchase", "/api/v1/purchases", "POST", "PURCHASES"));
            arr.add(new Permission("Get a purchase by userId", "/api/v1/purchases/user/{userId}", "GET", "PURCHASES"));
            arr.add(new Permission("Delete a purchase", "/api/v1/purchases/{id}", "DELETE", "PURCHASES"));
            arr.add(new Permission("Get a purchase by id", "/api/v1/purchases/{id}", "GET", "PURCHASES"));
            arr.add(new Permission("Get purchases by subjectId", "/api/v1/purchases/subject/{subjectId}", "GET",
                    "PURCHASES"));

            arr.add(new Permission("Create a question", "/api/v1/questions", "POST", "QUESTIONS"));
            arr.add(new Permission("Update a question", "/api/v1/questions", "PUT", "QUESTIONS"));
            arr.add(new Permission("Delete a question", "/api/v1/questions/{id}", "DELETE", "QUESTIONS"));
            arr.add(new Permission("Get a question by id", "/api/v1/questions/{id}", "GET", "QUESTIONS"));
            arr.add(new Permission("Get questions by subjectId", "/api/v1/questions/subject/{subjectId}", "GET",
                    "QUESTIONS"));

            arr.add(new Permission("Create a chapter", "/api/v1/chapters", "POST", "CHAPTERS"));
            arr.add(new Permission("Update a chapter", "/api/v1/chapters", "PUT", "CHAPTERS"));
            arr.add(new Permission("Delete a chapter", "/api/v1/chapters/{id}", "DELETE", "CHAPTERS"));
            arr.add(new Permission("Get a chapter by id", "/api/v1/chapters/{id}", "GET", "CHAPTERS"));
            arr.add(new Permission("Get chapters by subjectId", "/api/v1/chapters/subject/{subjectId}", "GET",
                    "CHAPTERS"));

            arr.add(new Permission("Download a file", "/api/v1/files", "GET", "FILES"));
            arr.add(new Permission("Upload a file", "/api/v1/files", "POST", "FILES"));
            this.permissionRepository.saveAll(arr);
        }

        if (countRole == 0) {
            List<Permission> allPermissions = this.permissionRepository.findAll();
            Role adminRole = new Role();
            adminRole.setName("SUPER_ADMIN");
            adminRole.setDescription("Admin thì full permission");
            adminRole.setActive(true);
            adminRole.setPermissions(allPermissions);
            this.roleRepository.save(adminRole);
        }

        // ensure a USER role exists (assign common GET/read permissions)
        if (this.roleRepository.findByName("USER") == null) {
            List<Permission> allPermissions = this.permissionRepository.findAll();
            List<Permission> userPermissions = allPermissions.stream()
                    .filter(p -> "GET".equalsIgnoreCase(p.getMethod()) && (p.getApiPath().startsWith("/api/v1/subjects")
                            || p.getApiPath().startsWith("/api/v1/questions")
                            || p.getApiPath().startsWith("/api/v1/purchases")
                            || p.getApiPath().startsWith("/api/v1/files")
                            || p.getApiPath().startsWith("/api/v1/users")))
                    .collect(Collectors.toList());
            Role userRole = new Role();
            userRole.setName("USER");
            userRole.setDescription("Default regular user with read permissions");
            userRole.setActive(true);
            userRole.setPermissions(userPermissions);
            this.roleRepository.save(userRole);
        }

        if (countUser == 0) {
            // create admin user
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

            // create regular user with USER role and common read permissions
            User regularUser = new User();
            regularUser.setEmail("user@gmail.com");
            regularUser.setAddress("hn");
            regularUser.setAge(22);
            regularUser.setGender(GenderEnum.FEMALE);
            regularUser.setName("Regular User");
            regularUser.setPassword(this.passwordEncoder.encode("123456"));

            Role userRole = this.roleRepository.findByName("USER");
            if (userRole != null) {
                regularUser.setRole(userRole);
            }
            this.userRepository.save(regularUser);
        }

        if (countPermission > 0 && countRole > 0 && countUser > 0) {
            System.out.println(">>> SHIP INIT DATABASE ~ AlREADY HAS DATA");
        }
    }

}
