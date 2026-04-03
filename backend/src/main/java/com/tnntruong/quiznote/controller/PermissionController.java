package com.tnntruong.quiznote.controller;

import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.domain.Permission;
import com.tnntruong.quiznote.dto.request.permission.ReqCreatePermissionDTO;
import com.tnntruong.quiznote.dto.request.permission.ReqUpdatePermissionDTO;
import com.tnntruong.quiznote.service.PermissionService;
import com.tnntruong.quiznote.service.RoleService;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1")
public class PermissionController {
    private PermissionService permissionService;
    private RoleService roleService;

    public PermissionController(PermissionService permissionService, RoleService roleService) {
        this.permissionService = permissionService;
        this.roleService = roleService;
    }

    @PostMapping("/permissions")
    @ApiMessage("create a permission")
    public ResponseEntity<?> createPermission(@Valid @RequestBody ReqCreatePermissionDTO req)
            throws InvalidException {
        boolean isExist = this.permissionService.isPermissionExist(req.getApiPath(), req.getMethod(), req.getModule());

        if (isExist) {
            throw new InvalidException("Permission is exist");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(this.permissionService.createPermission(req));
    }

    @PutMapping("/permissions")
    @ApiMessage("update a permission")
    public ResponseEntity<?> updatePermission(@Valid @RequestBody ReqUpdatePermissionDTO req)
            throws InvalidException {
        Optional<Permission> currentPer = this.permissionService.findById(req.getId());
        if (currentPer.isEmpty()) {
            throw new InvalidException("Permission với id = " + req.getId() + " không tồn tại");
        }

        boolean isExist = this.permissionService.isPermissionExist(
                req.getApiPath() != null ? req.getApiPath() : currentPer.get().getApiPath(),
                req.getMethod() != null ? req.getMethod() : currentPer.get().getMethod(),
                req.getModule() != null ? req.getModule() : currentPer.get().getModule());
        if (isExist) {
            throw new InvalidException("Permission is exist");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.permissionService.updatePermission(req));
    }

    @GetMapping("/permissions")
    @ApiMessage("get all permission")
    public ResponseEntity<?> getAllPermission(@Filter Specification<Permission> spec, Pageable page) {
        return ResponseEntity.ok().body(this.permissionService.getALlPermission(spec, page));
    }

    @DeleteMapping("/permissions/{id}")
    @ApiMessage("delete permission by id")
    public ResponseEntity<?> deletePermission(@PathVariable("id") long id) throws InvalidException {
        Optional<Permission> currentPer = this.permissionService.findById(id);
        if (currentPer.isEmpty()) {
            throw new InvalidException("Permission với id = " + id + " không tồn tại");
        }

        // Xóa permission khỏi tất cả các role có chứa nó
        long permissionId = currentPer.get().getId();
        currentPer.get().getRoles()
                .forEach(role -> this.roleService.removePermissionFromRole(role.getId(), permissionId));

        // Xóa permission
        this.permissionService.deletePermission(id);

        return ResponseEntity.ok().body("Deleted permission with id = " + id);
    }
}
