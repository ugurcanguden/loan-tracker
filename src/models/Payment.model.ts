
export interface Payment {
    id ?: number;
    name : string;
    amount: number;
    startDate: string;
    isRecurring: number;
    installments: number; 
}