// API Response Types based on OpenAPI specification

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface SignUpDto {
  email: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// Statistics data structure from /statistics API
export interface Statistics {
  id: string;
  date: string;
  creative: string;
  creativeSize: string;
  country: string;
  lineItem1: string;
  lineItem2: string;
  lineItem3: string;
  lineItem4: string;
  lineItem5: string;
  lineItem6: string;
  lineItem7: string;
  impressions: string;
  clicks: string;
  clickRate: string;
  firstQuartileViews: string;
  midpointViews: string;
  thirdQuartileViews: string;
  completeViews: string;
  createdAt: string;
}
