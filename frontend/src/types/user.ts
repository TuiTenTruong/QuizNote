import { IResBase } from "./api";
import { IPaginationMeta } from "./pagination";

export type UserGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface IUser {
    id: number;
    name: string;
    email: string;
    gender: UserGender;
    address: string;
    age: number;
    avatarUrl: string;
}


export interface IUserPagination {
    meta: IPaginationMeta;
    result: IUser[];
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
    role?: UserRole;
}

export type IReqUpdateUser = Partial<Omit<IReqCreateUser, 'password'>> & {
    id?: number;
    password?: string;
};

export interface IResCreateUser extends IResBase<IUser> { }

export interface IResUpdateUser extends IResBase<IUser> { }

export interface IResGetUser extends IResBase<IUserPagination, string> { }

export interface IResDeleteUser extends IResBase<null, string> { }