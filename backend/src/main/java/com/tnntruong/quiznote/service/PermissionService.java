package com.tnntruong.quiznote.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Permission;
import com.tnntruong.quiznote.dto.request.permission.ReqCreatePermissionDTO;
import com.tnntruong.quiznote.dto.request.permission.ReqUpdatePermissionDTO;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.dto.response.permission.ResPermissionDTO;
import com.tnntruong.quiznote.repository.PermissionRepository;

@Service
public class PermissionService {
    private PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public boolean isPermissionExist(String apiPath, String method, String module) {
        return this.permissionRepository.existsByApiPathAndMethodAndModule(apiPath, method, module);
    }

    public ResPermissionDTO createPermission(ReqCreatePermissionDTO req) {
        Permission newPermission = new Permission();
        newPermission.setName(req.getName());
        newPermission.setApiPath(req.getApiPath());
        newPermission.setMethod(req.getMethod());
        newPermission.setModule(req.getModule());

        Permission savedPermission = this.permissionRepository.save(newPermission);
        return convertPermissionToDTO(savedPermission);
    }

    public ResPermissionDTO updatePermission(ReqUpdatePermissionDTO req) {
        Optional<Permission> curPermission = this.findById(req.getId());
        if (curPermission.isPresent()) {
            if (req.getName() != null) {
                curPermission.get().setName(req.getName());
            }
            if (req.getApiPath() != null) {
                curPermission.get().setApiPath(req.getApiPath());
            }
            if (req.getMethod() != null) {
                curPermission.get().setMethod(req.getMethod());
            }
            if (req.getModule() != null) {
                curPermission.get().setModule(req.getModule());
            }

            Permission updatedPermission = this.permissionRepository.save(curPermission.get());
            return convertPermissionToDTO(updatedPermission);
        }
        return null;
    }

    private ResPermissionDTO convertPermissionToDTO(Permission permission) {
        ResPermissionDTO dto = new ResPermissionDTO();
        dto.setId(permission.getId());
        dto.setName(permission.getName());
        dto.setApiPath(permission.getApiPath());
        dto.setMethod(permission.getMethod());
        dto.setModule(permission.getModule());
        dto.setCreatedAt(permission.getCreatedAt());
        dto.setUpdatedAt(permission.getUpdatedAt());
        return dto;
    }

    public Optional<Permission> findById(long id) {
        return this.permissionRepository.findById(id);
    }

    public ResResultPagination getALlPermission(Specification<Permission> spec, Pageable page) {
        Page<Permission> permissionPage = this.permissionRepository.findAll(spec, page);
        ResResultPagination res = new ResResultPagination();
        ResResultPagination.Meta meta = new ResResultPagination.Meta();

        meta.setPage(permissionPage.getNumber() + 1);
        meta.setPageSize(permissionPage.getSize());
        meta.setPages(permissionPage.getTotalPages());
        meta.setTotal(permissionPage.getTotalElements());

        res.setMeta(meta);
        res.setResult(permissionPage.getContent().stream().map(this::convertPermissionToDTO).toList());

        return res;
    }

    public void deletePermission(long id) {
        this.permissionRepository.deleteById(id);
    }
}
