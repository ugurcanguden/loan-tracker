export interface PaymentDetail {
    id?: number;
    paymentId: number;
    amount: number;
    dueDate: string;
    isPaid: number;
    paidDate?: string;
    paymentMethod?: string;
    notes?: string;
    isOverdue?: number;
}