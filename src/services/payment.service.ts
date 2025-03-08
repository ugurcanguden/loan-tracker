import { Payment, PaymentDetail } from "@guden-models";
import { getDatabase } from "./db";

interface PaymentWithStats extends Payment {
    totalInstallments: number;
    paidInstallments: number;
    totalPaid: number;
    progress: number;
}

interface PaymentSummary {
    totalAmount: number;
    totalPayments: number;
    recurringPayments: number;
    oneTimePayments: number;
    totalPaid: number;
    totalRemaining: number;
}

const initializeDatabase = async () => {
    try {
        const db = await getDatabase();
        if (!db) {
            throw new Error('Veritabanı bağlantısı kurulamadı');
        }
        
        // Veritabanı bağlantısını test et
        await db.execAsync('SELECT 1');
        return db;
    } catch (error) {
        console.error('Veritabanı başlatılırken hata:', error);
        
        // Veritabanını yeniden başlatmayı dene
        try {
            // Mevcut bağlantıyı kapat
            const db = await getDatabase();
            if (db) {
                await db.closeAsync();
            }
            
            // Yeni bağlantı oluştur
            const newDb = await getDatabase();
            if (!newDb) {
                throw new Error('Veritabanı yeniden başlatılamadı');
            }
            return newDb;
        } catch (retryError) {
            console.error('Veritabanı yeniden başlatılırken hata:', retryError);
            throw new Error('Veritabanı bağlantısı kurulamadı. Lütfen uygulamayı yeniden başlatın.');
        }
    }
};

export const PaymentService = () => { 
    const addPayment = async (payment: Payment) => {
        const db = await initializeDatabase();
        try {
            // Ana ödeme kaydını ekle
            const result = await db.runAsync(
                `INSERT INTO payments (
                    name, 
                    amount, 
                    startDate, 
                    isRecurring,
                    installments,
                    description
                ) VALUES(?,?,?,?,?,?);`,
                payment.name,
                payment.amount,
                payment.startDate,
                payment.isRecurring,
                payment.installments,
                payment.description || ''
            );

            const paymentId = result.lastInsertRowId;

            // Eğer taksitli ödeme ise, taksit detaylarını hesapla ve ekle
            if (payment.isRecurring === 1 && payment.installments > 0) {
                const monthlyAmount = payment.amount / payment.installments;
                const startDate = new Date(payment.startDate);

                for (let i = 0; i < payment.installments; i++) {
                    const dueDate = new Date(startDate);
                    dueDate.setMonth(dueDate.getMonth() + i);

                    await db.runAsync(
                        `INSERT INTO payment_details (
                            paymentId, 
                            amount, 
                            dueDate,
                            isPaid
                        ) VALUES (?, ?, ?, ?);`,
                        paymentId,
                        monthlyAmount.toFixed(2),
                        dueDate.toISOString(),
                        0 // Başlangıçta ödenmemiş olarak işaretle
                    );
                }
            } else {
                // Tek seferlik ödeme için tek bir detay kaydı
                await db.runAsync(
                    `INSERT INTO payment_details (
                        paymentId, 
                        amount, 
                        dueDate,
                        isPaid
                    ) VALUES (?, ?, ?, ?);`,
                    paymentId,
                    payment.amount,
                    payment.startDate,
                    0
                );
            }

            return paymentId;
        } catch (error) {
            console.error('Ödeme eklenirken hata:', error);
            throw error;
        }
        finally {
            if (db) {
                await db.closeAsync();
            }
        }
    };

    const getPayments = async (): Promise<PaymentWithStats[]> => {
        const db = await initializeDatabase();
        try {
            const allRows = await db.getAllAsync(`
                SELECT 
                    p.*,
                    COUNT(pd.id) as totalInstallments,
                    SUM(CASE WHEN pd.isPaid = 1 THEN 1 ELSE 0 END) as paidInstallments,
                    SUM(CASE WHEN pd.isPaid = 1 THEN pd.amount ELSE 0 END) as totalPaid
                FROM payments p
                LEFT JOIN payment_details pd ON p.id = pd.paymentId
                GROUP BY p.id
                ORDER BY p.startDate DESC;
            `);
            
            return (allRows as any[]).map(row => ({
                ...row,
                progress: (row.paidInstallments / row.totalInstallments) * 100
            }));
        } catch (error) {
            console.error('Ödemeler getirilirken hata:', error);
            throw error;
        }        finally {
            if (db) {
                await db.closeAsync();
            }
        }
    };

    const getPaymentDetails = async (paymentId: number): Promise<PaymentDetail[]> => {
        const db = await initializeDatabase();
        try {
            const allRows = await db.getAllAsync(`
                SELECT 
                    pd.*,
                    CASE 
                        WHEN date(pd.dueDate) < date('now') AND pd.isPaid = 0 
                        THEN 1 
                        ELSE 0 
                    END as isOverdue
                FROM payment_details pd
                WHERE pd.paymentId = ?
                ORDER BY pd.dueDate ASC;
            `, [paymentId]);
            
            return allRows as PaymentDetail[];
        } catch (error) {
            console.error('Ödeme detayları getirilirken hata:', error);
            throw error;
        }        finally {
            if (db) {
                await db.closeAsync();
            }
        }
    };

    const markInstallmentAsPaid = async (detailId: number) => {
        const db = await initializeDatabase();
        try {
            await db.runAsync(
                'UPDATE payment_details SET isPaid = 1, paidDate = date("now") WHERE id = ?;',
                [detailId]
            );
        } catch (error) {
            console.error('Taksit ödenmiş olarak işaretlenirken hata:', error);
            throw error;
        }
        finally {
            if (db) {
                await db.closeAsync();
            }
        }
    };

    const unmarkInstallmentAsPaid = async (detailId: number) => {
        const db = await initializeDatabase();
        try {
            await db.runAsync(
                'UPDATE payment_details SET isPaid = 0, paidDate = NULL WHERE id = ?;',
                [detailId]
            );
        } catch (error) {
            console.error('Taksit ödenmemiş olarak işaretlenirken hata:', error);
            throw error;
        }        finally {
            if (db) {
                await db.closeAsync();
            }
        }
    };

    const deletePayment = async (id: number) => {
        const db = await initializeDatabase();
        try {
            await db.runAsync('DELETE FROM payments WHERE id = ?;', [id]);
        } catch (error) {
            console.error('Ödeme silinirken hata:', error);
            throw error;
        }        finally {
            if (db) {
                await db.closeAsync();
            }
        }
    };

    const getPaymentSummary = async (): Promise<PaymentSummary> => {
        const db = await initializeDatabase();
        try {
            const summary = await db.getAllAsync(`
                SELECT 
                    SUM(amount) as totalAmount,
                    COUNT(*) as totalPayments,
                    SUM(CASE WHEN isRecurring = 1 THEN 1 ELSE 0 END) as recurringPayments,
                    SUM(CASE WHEN isRecurring = 0 THEN 1 ELSE 0 END) as oneTimePayments
                FROM payments;
            `);

            const detailSummary = await db.getAllAsync(`
                SELECT 
                    SUM(CASE WHEN isPaid = 1 THEN amount ELSE 0 END) as totalPaid,
                    SUM(CASE WHEN isPaid = 0 THEN amount ELSE 0 END) as totalRemaining
                FROM payment_details;
            `);

            return {
                ...(summary[0] as any),
                ...(detailSummary[0] as any)
            } as PaymentSummary;
        } catch (error) {
            console.error('Özet bilgiler getirilirken hata:', error);
            throw error;
        }
        finally {
            if (db) {
                await db.closeAsync();
            }
        }
    };

    return {
        addPayment,
        getPayments,
        getPaymentDetails,
        deletePayment,
        markInstallmentAsPaid,
        unmarkInstallmentAsPaid,
        getPaymentSummary
    };
};