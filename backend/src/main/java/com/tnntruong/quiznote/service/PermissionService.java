package com.tnntruong.quiznote.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Permission;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.repository.PermissionRepository;

@Service
public class PermissionService {
    private PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public boolean isPermissionExist(Permission permission) {
        return this.permissionRepository.existsByApiPathAndMethodAndModule(permission.getApiPath(),
                permission.getMethod(), permission.getModule());
    }

    public Permission createPermission(Permission newPermission) {
        return this.permissionRepository.save(newPermission);
    }

    public Permission updatePermission(Permission permission) {
        Optional<Permission> curPermission = this.findById(permission.getId());
        if (curPermission.isPresent()) {
            curPermission.get().setName(permission.getName());
            curPermission.get().setApiPath(permission.getApiPath());
            curPermission.get().setMethod(permission.getMethod());
            curPermission.get().setModule(permission.getModule());

            return this.permissionRepository.save(curPermission.get());
        }
        return null;
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
        res.setResult(permissionPage.getContent());

        return res;
    }

    public void deletePermission(long id) {
        this.permissionRepository.deleteById(id);
    }
}
