import { IPaginationMeta } from "./pagination";
import { IResBase } from "./api";

export type PermissionMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type PermissionModule =
    | 'USERS'
    | 'ROLES'
    | 'PERMISSIONS'
    | 'SUBJECTS'
    | 'QUESTIONS'
    | 'SUBMISSIONS'
    | 'COMMENTS'
    | 'PAYMENTS'
    | 'REWARDS'
    | 'WEEKLY_QUIZ'
    | 'ADMIN';

export interface IPermission {
    id: number;
    name: string;
    apiPath: string;
    method: PermissionMethod;
    module: PermissionModule;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPermissionPagination {
    meta: IPaginationMeta;
    result: IPermission[];
}

export interface IRole {
    id: number;
    name: string;
    description?: string;
    active: boolean;
    permissions?: IPermission[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IRolePagination {
    meta: IPaginationMeta;
    result: IRole[];
}

export interface IReqCreateRole {
    name: string;
    description?: string;
    active?: boolean;
    permissions?: number[];
}

export interface IReqUpdateRole extends Partial<IReqCreateRole> {
    id: number;
}

export interface IReqCreatePermission {
    name: string;
    apiPath: string;
    method: PermissionMethod;
    module: PermissionModule;
}

export interface IReqUpdatePermission extends Partial<IReqCreatePermission> {
    id: number;
}

export interface IResGetRoles extends IResBase<IRole[], string> { }

export interface IResGetRolesPaginated extends IResBase<IRolePagination, string> { }

export interface IResCreateRole extends IResBase<IRole> { }

export interface IResUpdateRole extends IResBase<IRole> { }

export interface IResDeleteRole extends IResBase<null, string> { }

export interface IResGetPermissions extends IResBase<IPermission[], string> { }

export interface IResGetPermissionsPaginated extends IResBase<IPermissionPagination, string> { }

export interface IResCreatePermission extends IResBase<IPermission> { }

export interface IResUpdatePermission extends IResBase<IPermission> { }

export interface IResDeletePermission extends IResBase<null, string> { }
