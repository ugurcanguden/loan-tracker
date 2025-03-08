import { Income, IncomeSummary } from "@guden-models";
import { getDatabase } from "./db";

export const IncomeService = () => {
    const addIncome = async (income: Income) => {
        const db = await getDatabase();
        try {
            const result = await db.runAsync(
                `INSERT INTO incomes (
                    name, 
                    amount, 
                    date,
                    description
                ) VALUES(?,?,?,?);`,
                income.name,
                income.amount,
                income.date,
                income.description || ''
            );

            return result.lastInsertRowId;
        } catch (error) {
            console.error('Gelir eklenirken hata:', error);
            throw error;
        }
    };

    const getIncomes = async (startDate?: string, endDate?: string): Promise<Income[]> => {
        const db = await getDatabase();
        try {
            let query = 'SELECT * FROM incomes';
            const params: any[] = [];

            if (startDate || endDate) {
                query += ' WHERE 1=1';
                
                if (startDate) {
                    query += ' AND date >= ?';
                    params.push(startDate);
                }
                
                if (endDate) {
                    query += ' AND date <= ?';
                    params.push(endDate);
                }
            }

            query += ' ORDER BY date DESC;';
            
            const result = await db.getAllAsync(query, params);
            return result as Income[];
        } catch (error) {
            console.error('Gelirler getirilirken hata:', error);
            throw error;
        }
    };

    const deleteIncome = async (id: number) => {
        const db = await getDatabase();
        try {
            await db.runAsync('DELETE FROM incomes WHERE id = ?;', [id]);
        } catch (error) {
            console.error('Gelir silinirken hata:', error);
            throw error;
        }
    };

    const getIncomeSummary = async (startDate?: string, endDate?: string): Promise<IncomeSummary> => {
        const db = await getDatabase();
        try {
            let query = `
                SELECT 
                    SUM(amount) as totalAmount,
                    COUNT(*) as totalIncomes,
                    SUM(CASE 
                        WHEN strftime('%Y-%m', date) = strftime('%Y-%m', 'now') 
                        THEN amount ELSE 0 END) as monthlyTotal,
                    SUM(CASE 
                        WHEN strftime('%Y', date) = strftime('%Y', 'now') 
                        THEN amount ELSE 0 END) as yearlyTotal
                FROM incomes
            `;
            const params: any[] = [];

            if (startDate || endDate) {
                query += ' WHERE 1=1';
                
                if (startDate) {
                    query += ' AND date >= ?';
                    params.push(startDate);
                }
                
                if (endDate) {
                    query += ' AND date <= ?';
                    params.push(endDate);
                }
            }

            query += ';';

            const summary = await db.getAllAsync(query, params);
            return summary[0] as IncomeSummary;
        } catch (error) {
            console.error('Özet bilgiler getirilirken hata:', error);
            throw error;
        }
    };

    return {
        addIncome,
        getIncomes,
        deleteIncome,
        getIncomeSummary
    };
}; 