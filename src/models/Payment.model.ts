export interface Payment {
    id?: number;
    name: string;
    amount: number;
    startDate: string;
    isRecurring: number;
    installments: number;
    description?: string;
    created_at?: string;
    // İstatistikler için ek alanlar
    totalInstallments?: number;
    paidInstallments?: number;
    totalPaid?: number;
    progress?: number;
}