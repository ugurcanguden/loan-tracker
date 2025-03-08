export const PAYMENT_DETAIL_QUERIES = {
    INSERT: `INSERT INTO payment_details (
        paymentId, amount, dueDate, isPaid
    ) VALUES (?, ?, ?, ?);`,
    GET_BY_PAYMENT_ID: `
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
    `,
    MARK_AS_PAID: `UPDATE payment_details SET isPaid = 1, paidDate = date('now') WHERE id = ?;`,
    UNMARK_AS_PAID: `UPDATE payment_details SET isPaid = 0, paidDate = NULL WHERE id = ?;`,
    GET_SUMMARY: `
        SELECT 
            SUM(CASE WHEN isPaid = 1 THEN amount ELSE 0 END) as totalPaid,
            SUM(CASE WHEN isPaid = 0 THEN amount ELSE 0 END) as totalRemaining
        FROM payment_details;
    `
}; 