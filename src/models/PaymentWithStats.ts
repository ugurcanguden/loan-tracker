import { Payment } from "./Payment.model";

export interface PaymentWithStats extends Payment {
    totalInstallments: number;
    paidInstallments: number;
    totalPaid: number;
    progress: number;
  }
   