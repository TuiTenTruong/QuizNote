package com.tnntruong.quiznote.service;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Role;
import com.tnntruong.quiznote.dto.request.role.ReqCreateRoleDTO;
import com.tnntruong.quiznote.dto.request.role.ReqUpdateRoleDTO;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.dto.response.permission.ResPermissionDTO;
import com.tnntruong.quiznote.dto.response.role.ResRoleDTO;
import com.tnntruong.quiznote.dto.response.role.ResRoleDTO.PermissionDTO;
import com.tnntruong.quiznote.repository.PermissionRepository;
import com.tnntruong.quiznote.repository.RoleRepository;

@Service
public class RoleService {
    private RoleRepository roleRepository;
    private PermissionRepository permissionRepository;

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public boolean isExistByName(String name) {
        return this.roleRepository.existsByName(name);
    }

    public Optional<Role> findById(long id) {
        return this.roleRepository.findById(id);
    }

    public ResRoleDTO createRole(ReqCreateRoleDTO req) {
        Role newRole = new Role();
        newRole.setName(req.getName());
        newRole.setDescription(req.getDescription());
        newRole.setActive(req.isActive());
        return convertRoleToDTO(this.roleRepository.save(newRole));
    }

    public ResRoleDTO updateRole(ReqUpdateRoleDTO req) {
        Optional<Role> roleOptional = this.findById(req.getId());
        Role currentRole = roleOptional.get();

        if (req.getName() != null) {
            currentRole.setName(req.getName());
        }
        if (req.getDescription() != null) {
            currentRole.setDescription(req.getDescription());
        }
        if (req.getActive() != null) {
            currentRole.setActive(req.getActive());
        }

        return convertRoleToDTO(this.roleRepository.save(currentRole));
    }

    private ResRoleDTO convertRoleToDTO(Role role) {
        ResRoleDTO dto = new ResRoleDTO();
        PermissionDTO[] permissions = new PermissionDTO[role.getPermissions() != null ? role.getPermissions().size()
                : 0];
        permissions = role.getPermissions().stream().map(permission -> {
            PermissionDTO perDTO = new PermissionDTO();
            perDTO.setId(permission.getId());
            perDTO.setName(permission.getName());
            perDTO.setApiPath(permission.getApiPath());
            perDTO.setMethod(permission.getMethod());
            perDTO.setModule(permission.getModule());
            return perDTO;
        }).toArray(PermissionDTO[]::new);
        dto.setPermissions(permissions);
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        dto.setActive(role.isActive());
        dto.setCreatedAt(role.getCreatedAt());
        dto.setUpdatedAt(role.getUpdatedAt());
        dto.setCreatedBy(role.getCreatedBy());
        dto.setUpdatedBy(role.getUpdatedBy());
        return dto;
    }

    public ResResultPagination fetchAllRole(Specification<Role> spec, Pageable page) {
        Page<Role> allRoles = this.roleRepository.findAll(spec, page);
        ResResultPagination res = new ResResultPagination();

        ResResultPagination.Meta meta = new ResResultPagination.Meta();
        meta.setPage(allRoles.getNumber() + 1);
        meta.setPageSize(allRoles.getSize());
        meta.setPages(allRoles.getTotalPages());
        meta.setTotal(allRoles.getTotalElements());

        res.setMeta(meta);
        res.setResult(allRoles.getContent().stream().map(this::convertRoleToDTO).collect(Collectors.toList()));

        return res;
    }

    public void deleteRole(long id) {
        this.roleRepository.deleteById(id);
    }

    public void removePermissionFromRole(long roleId, long permissionId) {
        Optional<Role> roleOptional = this.roleRepository.findById(roleId);
        if (roleOptional.isEmpty()) {
            return;
        }

        Role role = roleOptional.get();
        if (role.getPermissions() == null) {
            return;
        }

        role.getPermissions().removeIf(permission -> permission.getId() == permissionId);
        this.roleRepository.save(role);
    }

    public Role findByName(String name) {
        return this.roleRepository.findByName(name);
    }
}
