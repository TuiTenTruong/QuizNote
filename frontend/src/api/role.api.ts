import instance from "./client";
import type { IApiResponse, IApiSuccessResponse } from "../types/api";
import type {
    IRole,
    IPermission,
    IReqCreateRole,
    IReqUpdateRole,
    IReqCreatePermission,
    IReqUpdatePermission,
    IResGetRoles,
    IResGetRolesPaginated,
    IResCreateRole,
    IResUpdateRole,
    IResDeleteRole,
    IResGetPermissionsPaginated,
    IResCreatePermission,
    IResUpdatePermission,
    IResDeletePermission,
} from "../types/role";

// ============ ROLES ============

// Get all roles
export const getAllRoles = (): Promise<IResGetRoles> => {
    return instance.get<never, IResGetRoles>('/api/v1/roles');
};

// Get roles paginated
export const getRolesPaginated = (page: number = 0, size: number = 10): Promise<IResGetRolesPaginated> => {
    return instance.get<never, IResGetRolesPaginated>(`/api/v1/roles?page=${page}&size=${size}`);
};

// Create role
export const createRole = (data: IReqCreateRole): Promise<IResCreateRole> => {
    return instance.post<never, IResCreateRole>('/api/v1/roles', data);
};

// Update role
export const updateRole = (data: IReqUpdateRole): Promise<IResUpdateRole> => {
    return instance.put<never, IResUpdateRole>('/api/v1/roles', data);
};

// Delete role
export const deleteRole = (roleId: number): Promise<IResDeleteRole> => {
    return instance.delete<never, IResDeleteRole>(`/api/v1/roles/${roleId}`);
};

// ============ PERMISSIONS ============

// Get all permissions
export const getAllPermissions = (page: number = 0, size: number = 100): Promise<IResGetPermissionsPaginated> => {
    return instance.get<never, IResGetPermissionsPaginated>(`/api/v1/permissions?page=${page}&size=${size}`);
};

// Create permission
export const createPermission = (data: IReqCreatePermission): Promise<IResCreatePermission> => {
    return instance.post<never, IResCreatePermission>('/api/v1/permissions', data);
};

// Update permission
export const updatePermission = (data: IReqUpdatePermission): Promise<IResUpdatePermission> => {
    return instance.put<never, IResUpdatePermission>('/api/v1/permissions', data);
};

// Delete permission
export const deletePermission = (permissionId: number): Promise<IResDeletePermission> => {
    return instance.delete<never, IResDeletePermission>(`/api/v1/permissions/${permissionId}`);
};
