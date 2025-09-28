package com.tnntruong.quiznote.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.domain.Role;
import com.tnntruong.quiznote.service.RoleService;
import com.tnntruong.quiznote.service.response.ResResultPagination;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class RoleController {
    private RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/roles")
    @ApiMessage("create a role")
    public ResponseEntity<Role> createRole(@Valid @RequestBody Role newRole) throws InvalidException {
        boolean isExist = this.roleService.isExistByName(newRole.getName());
        if (isExist) {
            throw new InvalidException("role with name = " + newRole.getName() + " exist");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.createRole(newRole));
    }

    @PutMapping("/roles")
    @ApiMessage("update a role")
    public ResponseEntity<Role> updateRole(@Valid @RequestBody Role newRole) throws InvalidException {
        Optional<Role> roleOptional = this.roleService.findById(newRole.getId());
        if (roleOptional.isEmpty()) {
            throw new InvalidException("role with id = " + newRole.getId() + "does not exist");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.updateRole(newRole));
    }

    @GetMapping("/roles")
    @ApiMessage("get all role")
    public ResponseEntity<ResResultPagination> getAllRole(@Filter Specification<Role> spec, Pageable page) {
        return ResponseEntity.ok().body(this.roleService.fetchAllRole(spec, page));
    }

    @DeleteMapping("/roles/{id}")
    @ApiMessage("delete role by id")
    public ResponseEntity<Void> deleteRole(@PathVariable("id") long id) throws InvalidException {
        Optional<Role> roleOptional = this.roleService.findById(id);
        if (roleOptional.isEmpty()) {
            throw new InvalidException("role with id = " + id + "does not exist");
        }
        this.roleService.deleteRole(id);
        return ResponseEntity.ok().body(null);
    }
}
