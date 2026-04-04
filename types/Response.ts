export type Response<T> = SuccessResponse<T> | ErrorResponse;

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export const SuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});

export const ErrorResponse = (error: string): ErrorResponse => ({
  success: false,
  error,
});
