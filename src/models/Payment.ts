export interface Payment {
  id?: number;
  name: string;
  amount: number;
  startDate: string;
  isRecurring: number;
  installments: number;
  description?: string;
  created_at?: string;
  // Ödeme detayları için ek alanlar
  dueDate?: string;
  installment_amount?: number;
  isPaid?: number;
  paidDate?: string;
  // İstatistikler için ek alanlar
  totalInstallments?: number;
  paidInstallments?: number;
  totalPaid?: number;
  progress?: number;
}

export interface PaymentDetail {
  id?: number;
  paymentId: number;
  amount: number;
  dueDate: string;
  isPaid: number;
  paidDate?: string;
  isOverdue?: number;
}

export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  recurringPayments: number;
  oneTimePayments: number;
  totalPaid: number;
  totalRemaining: number;
  monthlyPayment: number;
  overdueCount: number;
}

export interface PaymentWithStats extends Payment {
  totalInstallments: number;
  paidInstallments: number;
  totalPaid: number;
  progress: number;
} 
