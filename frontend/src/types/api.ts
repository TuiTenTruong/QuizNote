import { IPaginationMeta } from './pagination';

/**
 * Cấu trúc phản hồi cơ bản từ backend
 */
export interface IApiResponse<TData, TMessage = string | string[]> {
    statusCode: number;
    message: TMessage;
    data: TData;
    error?: string;
}

/**
 * Phản hồi có phân trang
 */
export interface IPaginatedData<T> {
    meta: IPaginationMeta;
    result: T[];
}

/**
 * Phản hồi có phân trang từ API
 */
export interface IApiPaginatedResponse<T> extends IApiResponse<IPaginatedData<T>, string> { }

/**
 * Phản hồi thành công không có data
 */
export interface IApiSuccessResponse extends IApiResponse<null, string> { }

/**
 * Phản hồi lỗi từ API
 */
export interface IApiErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
    data?: null;
}

/**
 * HTTP Status codes thường dùng
 */
export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
}

/**
 * Kiểu alias cho IApiResponse (tương thích với IResBase cũ)
 */
export type IResBase<TData, TMessage = string | string[]> = IApiResponse<TData, TMessage>;
