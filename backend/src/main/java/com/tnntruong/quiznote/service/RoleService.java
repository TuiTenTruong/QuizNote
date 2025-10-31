package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Permission;
import com.tnntruong.quiznote.domain.Role;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
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

    public Role createRole(Role newRole) {
        if (newRole.getPermissions() != null) {
            List<Long> listPermission = newRole.getPermissions().stream().map(permission -> permission.getId())
                    .collect(Collectors.toList());
            List<Permission> dbPermission = this.permissionRepository.findByIdIn(listPermission);

            newRole.setPermissions(dbPermission);
        }
        return this.roleRepository.save(newRole);
    }

    public Role updateRole(Role newRole) {
        Optional<Role> roleOptional = this.findById(newRole.getId());
        Role currentRole = roleOptional.get();

        currentRole.setName(newRole.getName());
        currentRole.setDescription(newRole.getDescription());
        currentRole.setActive(newRole.isActive());

        if (newRole.getPermissions() != null) {
            List<Long> listPermission = newRole.getPermissions().stream().map(permission -> permission.getId())
                    .collect(Collectors.toList());
            List<Permission> dbPermission = this.permissionRepository.findByIdIn(listPermission);

            currentRole.setPermissions(dbPermission);
        }
        return this.roleRepository.save(currentRole);
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
        res.setResult(allRoles.getContent());

        return res;
    }

    public void deleteRole(long id) {
        this.roleRepository.deleteById(id);
    }
}
