export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
  
  export interface Timestamps {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }