export const CREATE_TABLES = {
    PAYMENTS: `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,                    -- Kredi/Ödeme Adı
        amount REAL NOT NULL,                  -- Toplam Tutar
        startDate TEXT NOT NULL,               -- Başlangıç Tarihi
        isRecurring INTEGER DEFAULT 0,         -- Taksitli mi? (0: Hayır, 1: Evet)
        installments INTEGER DEFAULT 1,        -- Taksit Sayısı
        description TEXT,                      -- Açıklama
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    PAYMENT_DETAILS: `CREATE TABLE IF NOT EXISTS payment_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paymentId INTEGER NOT NULL,            -- Bağlı olduğu ödeme/kredi ID
        amount REAL NOT NULL,                  -- Taksit Tutarı
        dueDate TEXT NOT NULL,                 -- Vade Tarihi
        isPaid INTEGER DEFAULT 0,              -- Ödendi mi? (0: Hayır, 1: Evet)
        paidDate TEXT,                         -- Ödenme Tarihi
        paymentMethod TEXT,                    -- Ödeme Yöntemi (Nakit, Havale, vs.)
        notes TEXT,                            -- Notlar
        FOREIGN KEY(paymentId) REFERENCES payments(id) ON DELETE CASCADE
    );`
}; 