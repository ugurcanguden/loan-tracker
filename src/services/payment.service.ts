import { Payment, PaymentDetail, PaymentSummary, PaymentWithStats, UpcomingPayment } from "@guden-models";
import { getDatabase } from "./db";
export const PaymentService = () => {
  const addPayment = async (payment: Payment) => {
    const db = await getDatabase();
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
        payment.description || ""
      );

      const paymentId = result.lastInsertRowId;
      // Eğer taksitli ödeme ise, taksit detaylarını hesapla ve ekle
      if (payment.isRecurring === 1 && payment.installments > 0) {
        const monthlyAmount = payment.amount / payment.installments;
        const startDate = new Date(payment.startDate);

        for (let i = 0; i < payment.installments; i++) {
          const dueDate = new Date(startDate);
          dueDate.setMonth(dueDate.getMonth() + i);
          console.log(paymentId,
            monthlyAmount.toFixed(2),
            dueDate.toISOString(),
            0);
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
      console.error("Ödeme eklenirken hata:", error);
      throw error;
    }
  };
  const getPaymentDetails = async (
    paymentId: number
  ): Promise<PaymentDetail[]> => {
    const db = await getDatabase();
    try {
      const allRows = await db.getAllAsync(
        `
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
        [paymentId]
      );
      return allRows as PaymentDetail[];
    } catch (error) {
      console.error("Ödeme detayları getirilirken hata:", error);
      throw error;
    }
  };

  const markInstallmentAsPaid = async (detailId: number) => {
    const db = await getDatabase();
    try {
      await db.runAsync(
        'UPDATE payment_details SET isPaid = 1, paidDate = date("now") WHERE id = ?;',
        [detailId]
      );
    } catch (error) {
      console.error("Taksit ödenmiş olarak işaretlenirken hata:", error);
      throw error;
    }
  };

  const unmarkInstallmentAsPaid = async (detailId: number) => {
    const db = await getDatabase();
    try {
      await db.runAsync(
        "UPDATE payment_details SET isPaid = 0, paidDate = NULL WHERE id = ?;",
        [detailId]
      );
    } catch (error) {
      console.error("Taksit ödenmemiş olarak işaretlenirken hata:", error);
      throw error;
    }
  };

  const deletePayment = async (id: number) => {
    const db = await getDatabase();
    try {
      await db.runAsync("DELETE FROM payments WHERE id = ?;", [id]);
    } catch (error) {
      console.error("Ödeme silinirken hata:", error);
      throw error;
    }
  };

  const getPayments = async (
    startDate?: string,
    endDate?: string
  ): Promise<PaymentWithStats[]> => {
    const db = await getDatabase();
    try {
      let query = `
        WITH filtered_details AS (
          SELECT 
            pd.paymentId,
            pd.amount,
            pd.isPaid,
            pd.dueDate
          FROM payment_details pd
          WHERE 1=1
            ${startDate ? "AND pd.dueDate >= ?" : ""}
            ${endDate ? "AND pd.dueDate <= ?" : ""}
          ORDER BY pd.dueDate DESC
        )
        SELECT 
          p.*,
          COUNT(fd.paymentId) as totalInstallments,
          SUM(CASE WHEN fd.isPaid = 1 THEN 1 ELSE 0 END) as paidInstallments,
          SUM(CASE WHEN fd.isPaid = 1 THEN fd.amount ELSE 0 END) as totalPaid
        FROM payments p
        INNER JOIN filtered_details fd ON p.id = fd.paymentId
        GROUP BY p.id 
        ORDER BY p.created_at DESC, p.id DESC;
      `;

      const params: any[] = [];
      if (startDate) params.push(startDate);
      if (endDate) params.push(endDate);

      const allRows = await db.getAllAsync(query, params);
      return (allRows as any[]).map((row) => ({
        ...row,
        progress: (row.paidInstallments / row.totalInstallments) * 100,
      }));
    } catch (error) {
      console.error("Ödemeler getirilirken hata:", error);
      throw error;
    }
  };

  const getPaymentSummary = async (
    startDate?: string,
    endDate?: string
  ): Promise<PaymentSummary> => {
    const db = await getDatabase();
    try {
      let query = `
 WITH filtered_details AS (
        SELECT 
          pd.paymentId,
          pd.amount,
          pd.isPaid,
          pd.dueDate
        FROM payment_details pd
        WHERE 1=1
          ${startDate ? "AND pd.dueDate >= ?" : ""}
          ${endDate ? "AND pd.dueDate <= ?" : ""}
          ${!startDate && !endDate ? "AND pd.dueDate >= date('now', '-1 year')" : ""}
      )
      SELECT 
        
        COUNT(DISTINCT p.id) as totalPayments,
        SUM(fd.amount) as totalAmount,
        SUM(CASE WHEN p.isRecurring = 1 THEN 1 ELSE 0 END) as recurringPayments,
        SUM(CASE WHEN p.isRecurring = 0 THEN 1 ELSE 0 END) as oneTimePayments,
        SUM(CASE WHEN fd.isPaid = 1 THEN fd.amount ELSE 0 END) as totalPaid,
        SUM(CASE WHEN fd.isPaid = 0 THEN fd.amount ELSE 0 END) as totalRemaining,
        SUM(CASE 
          WHEN strftime('%Y-%m', fd.dueDate) = strftime('%Y-%m', 'now') 
          THEN fd.amount ELSE 0 END) as monthlyPayment,
        COUNT(CASE 
          WHEN fd.isPaid = 0 AND fd.dueDate < date('now') 
          THEN 1 END) as overdueCount
      FROM payments p
      LEFT JOIN filtered_details fd ON p.id = fd.paymentId;
      `;

      const params: any[] = [];
      if (startDate) params.push(startDate);
      if (endDate) params.push(endDate);

      const summary = await db.getAllAsync(query, params);
      return summary[0] as PaymentSummary;
    } catch (error) {
      console.error("Özet bilgiler getirilirken hata:", error);
      throw error;
    }
  };

  const getUpcomingPayments = async (): Promise<UpcomingPayment[]> => {
    const db = await getDatabase();
    try {
      const query = `
        WITH upcoming_details AS (
          SELECT 
            pd.paymentId,
            pd.amount as installment_amount,
            pd.dueDate,
            pd.isPaid,
            pd.paidDate,
            ROW_NUMBER() OVER (PARTITION BY pd.paymentId ORDER BY pd.dueDate ASC) as next_installment
          FROM payment_details pd
          WHERE pd.dueDate <= date('now', '+10 days')
          AND pd.isPaid = 0
        )
        SELECT 
          p.*,
          ud.installment_amount,
          ud.dueDate,
          ud.isPaid,
          ud.paidDate,
          COUNT(*) OVER (PARTITION BY p.id) as remainingInstallments
        FROM payments p
        INNER JOIN upcoming_details ud ON p.id = ud.paymentId
        WHERE ud.next_installment = 1
        ORDER BY ud.dueDate ASC
        LIMIT 5;
      `;

      const payments = await db.getAllAsync(query);
      return payments as UpcomingPayment[];
    } catch (error) {
      console.error("Yaklaşan ödemeler getirilirken hata:", error);
      throw error;
    }
  };

  return {
    addPayment,
    getPayments,
    getPaymentDetails,
    deletePayment,
    markInstallmentAsPaid,
    unmarkInstallmentAsPaid,
    getPaymentSummary,
    getUpcomingPayments,
  };
};
