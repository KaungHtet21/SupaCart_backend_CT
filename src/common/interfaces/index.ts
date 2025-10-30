export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipInterface {
  id: string;
  userId: string;
  packageId: string;
  status: string;
  paymentStatus: string;
  paymentScreenshot?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckInInterface {
  id: string;
  userId: string;
  membershipId: string;
  status: string;
  checkInTime: Date;
  notes?: string;
}
