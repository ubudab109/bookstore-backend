export interface ApiResponse<T> {
  success: boolean;
  message: string | Array<string>;
  data: T;
}
