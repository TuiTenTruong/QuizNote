
package com.tnntruong.quiznote.controller;

import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.domain.Permission;
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
    public ResponseEntity<?> createPermission(@Valid @RequestBody Permission newPermission)
            throws InvalidException {
        boolean isExist = this.permissionService.isPermissionExist(newPermission);

        if (isExist) {
            throw new InvalidException("Permission is exist");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(this.permissionService.createPermission(newPermission));
    }

    @PutMapping("/permissions")
    @ApiMessage("update a permission")
    public ResponseEntity<?> updatePermission(@Valid @RequestBody Permission updatePermission)
            throws InvalidException {
        Optional<Permission> currentPer = this.permissionService.findById(updatePermission.getId());
        if (currentPer.isEmpty()) {
            throw new InvalidException("Permission với id = " + updatePermission.getId() + " không tồn tại");
        }

        boolean isExist = this.permissionService.isPermissionExist(updatePermission);
        if (isExist) {
            throw new InvalidException("Permission is exist");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.permissionService.updatePermission(updatePermission));
    }

    @GetMapping("/permissions")
    @ApiMessage("get all permission")
    public ResponseEntity<?> getAllPermission(@Filter Specification<Permission> spec, Pageable page) {
        return ResponseEntity.ok().body(this.permissionService.getALlPermission(spec, page));
    }

    @DeleteMapping("/permission/{id}")
    @ApiMessage("delete permission by id")
    public ResponseEntity<?> deletePermission(@PathVariable("id") long id) throws InvalidException {
        Optional<Permission> currentPer = this.permissionService.findById(id);
        if (currentPer.isEmpty()) {
            throw new InvalidException("Permission với id = " + id + " không tồn tại");
        }

        currentPer.get().getRoles().forEach(role -> this.roleService.deleteRole(role.getId()));
        this.permissionService.deletePermission(id);

        return ResponseEntity.ok().body(null);
    }
}
