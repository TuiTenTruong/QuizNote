import type { IUser, UserGender, UserRole } from './user';

export interface IAuthRole {
    id: number;
    name: string;
}

export interface IAuthUser extends Omit<IUser, 'address' | 'age' | 'avatarUrl'> {
    role: IAuthRole;
    avatarUrl?: string;
    address?: string;
    age?: number;
    coins?: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAuthPayload {
    access_token: string;
    refreshToken: string;
    user: IAuthUser;
}

export interface IAuthBaseResponse<TData, TMessage = string | string[]> {
    statusCode: number;
    message: TMessage;
    data: TData;
    error?: string;
}

export interface IReqLogin {
    username: string;
    password: string;
}

export interface IResLogin extends IAuthBaseResponse<IAuthPayload> { }

export interface IReqRegister {
    email: string;
    password: string;
    name: string;
    gender: UserGender;
    role?: UserRole;
    bankName?: string | null;
    bankAccount?: string | null;
}

export interface IResRegisterData {
    message: string;
    user?: IAuthUser;
}

export interface IResRegister extends IAuthBaseResponse<IResRegisterData> { }

export interface IResRefresh extends IAuthBaseResponse<IAuthPayload, string> { }

export interface IResLogout extends IAuthBaseResponse<null, string> { }

export interface IResCurrentUser extends IAuthBaseResponse<IAuthUser, string> { }

export interface IAuth {
    isAuthenticated: boolean;
    account: IAuthPayload | null;
}