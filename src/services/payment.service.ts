import { Payment, PaymentDetail } from "@guden-models";
import { getDatabase } from "./db";

export const PaymentService = () => { 
    const addPayment = async (payment: Payment) => {
        const db = await getDatabase();
        const result = await db.runAsync(
            `INSERT INTO payments (
                name, 
                amount, 
                startDate, 
                isRecurring,
                installments
                ) VALUES(?,?,?,?,?);`,
            payment.name,
            payment.amount,
            payment.startDate,
            payment.isRecurring,
            payment.installments
        );
        let paymentId = result.lastInsertRowId;
        if (payment.isRecurring) {
            for (let i = 0; i < payment.installments; i++) {
                const dueDate = new Date(payment.startDate);
                dueDate.setMonth(dueDate.getMonth() + i);
                await db.runAsync(
                    'INSERT INTO payment_details (paymentId, amount, dueDate) VALUES (?, ?, ?);',
                    paymentId, payment.amount / payment.installments, dueDate.toISOString()
                );
            }
        }

    };
    const getPayments = async () => {
        const db = await getDatabase();
        const allRows = await db.getAllAsync('SELECT * FROM payments;');
        return (allRows as (Payment & { id: number })[]).map(row => {
            const { id, ...rest } = row;  
            return { id, ...rest } as Payment;
        });
    };
    const getPaymentDetails = async (paymentId : number) => {
        const db = await getDatabase();
        const allRows = await db.getAllAsync(`SELECT * FROM payment_details where paymentId = ${paymentId};`);
        return (allRows as (PaymentDetail & { id: number })[]).map(row => {
            const { id, ...rest } = row; 
            return { id, ...rest } as PaymentDetail;
        });
    };

    const deletePayment = async (id: number) => {
        const db = await getDatabase();
        await db.execAsync(`DELETE FROM payments where id = ${id}`);
    };

    return {
        addPayment,
        getPayments,
        getPaymentDetails,
        deletePayment
    };
};
