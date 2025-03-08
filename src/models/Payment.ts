export interface PaymentSummary {
    totalAmount: number;
    totalPayments: number;
    recurringPayments: number;
    oneTimePayments: number;
    totalPaid: number;
    totalRemaining: number;
    monthlyPayment: number;
    overdueCount: number;
} 
