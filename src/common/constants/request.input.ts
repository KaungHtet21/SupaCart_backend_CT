export interface RequestInput {
  user?: any;
  body?: any;
  params?: any;
  query?: any;
}

export interface ResponseDto {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}
