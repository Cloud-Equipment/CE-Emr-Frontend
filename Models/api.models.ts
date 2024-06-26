export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  msg: string;
  message?: string;
  statusCode: number;
}

export interface PaginationData<T = any> {
  totalCount: number;
  currentPage: number;
  pageNumber: number;
  pageSize: number;
  resultItem: T[];
}
