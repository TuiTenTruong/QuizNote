import { IResBase } from "./api";
import { IPaginationMeta } from "./pagination";
import { IRole } from "./role";

export type UserGender = 'MALE' | 'FEMALE' | 'OTHER';
export type AdminUserModalType = 'add' | 'edit' | 'delete' | '';
export type AdminUserFilterStatus = 'All' | 'Active' | 'Inactive';

export interface IUser {
    id: number;
    name: string;
    email: string;
    gender: UserGender;
    address: string;
    age: number;
    avatarUrl: string;
}

export interface IAdminUser extends IUser {
    name: string;
    active: boolean;
    role: IRole;
    createdAt: string;
}

export interface IAdminUserFormData {
    id?: number;
    name: string;
    email: string;
    password: string;
    gender: UserGender;
    address: string;
    age: number | '';
    role: { id: number };
}


export interface IUserPagination {
    meta: IPaginationMeta;
    result: IUser[];
}

export interface IAdminUserPagination {
    meta: IPaginationMeta;
    result: IAdminUser[];
}

export type UserRole = string | { id: number; name?: string };

export interface IUserBankInfo {
    bankName?: string | null;
    bankAccount?: string | null;
}

type IUserCreateRequired = Pick<IUser, 'name' | 'email' | 'gender'>;
type IUserCreateOptional = Partial<Pick<IUser, 'address' | 'age' | 'avatarUrl'>>;

export interface IReqCreateUser extends IUserCreateRequired, IUserCreateOptional, IUserBankInfo {
    password: string;
    roleId?: number;
}

export type IReqUpdateUser = Partial<Omit<IReqCreateUser, 'password'>> & {
    id?: number;
    password?: string;
};

export interface IResCreateUser extends IResBase<IUser> { }

export interface IResUpdateUser extends IResBase<IUser> { }

export interface IResGetUser extends IResBase<IUserPagination, string> { }

export interface IResGetAdminUser extends IResBase<IAdminUserPagination, string> { }

export interface IResDeleteUser extends IResBase<null, string> { }