export interface Income {
    id?: number;
    name: string;
    amount: number;
    date: string;
    description?: string;
    created_at?: string;
}

export interface IncomeSummary {
    totalAmount: number;
    totalIncomes: number;
    monthlyTotal: number;
    yearlyTotal: number;
} 