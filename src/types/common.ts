export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface BaseEntity {
    id: string;
    created_at: string;
    updated_at?: string;
}

export interface ApiResponse<T> {
    data: T;
    error: Nullable<string>;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
    total: number;
    page: number;
    limit: number;
}

export interface SelectOption {
    label: string;
    value: string | number;
}

export type SortDirection = 'asc' | 'desc';
export type SortOrder = { field: string; direction: SortDirection };

export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: SortOrder;
    search?: string;
    filters?: Record<string, unknown>;
} 