export interface Transaction {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  paymentMethod?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  success: boolean;
  status: string;
  data: Transaction[];
  page?: number;
  size?: number;
  total?: number;
}
