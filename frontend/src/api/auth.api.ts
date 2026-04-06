import instance from "./client";
import type { IReqLogin, IReqRegister, IResLogin, IResLogout, IResRegister } from "../types/auth";

export const register = (data: IReqRegister): Promise<IResRegister> => {
    return instance.post<never, IResRegister>('/api/v1/auth/register', data);
};

export const login = (data: IReqLogin): Promise<IResLogin> => {
    return instance.post<never, IResLogin>('/api/v1/auth/login', data);
};

export const logout = (): Promise<IResLogout> => {
    return instance.post<never, IResLogout>('/api/v1/auth/logout');
};

export const refresh = (): Promise<IResLogin> => {
    return instance.get<never, IResLogin>('/api/v1/auth/refresh');
};