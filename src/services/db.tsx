import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const DB_NAME = "loan-tracker.db";

export const resetDatabase = async () => {
    try {
        // Veritabanı dosyasının yolunu al
        const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
        
        // Dosya varsa sil
        const { exists } = await FileSystem.getInfoAsync(dbPath);
        if (exists) {
            await FileSystem.deleteAsync(dbPath);
            console.log('Veritabanı başarıyla silindi');
        }
        
        // Yeni veritabanını oluştur
        return await setupDatabase();
    } catch (error) {
        console.error('Veritabanı sıfırlanırken hata:', error);
        throw error;
    }
};

export const setupDatabase = async () => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Loans/Payments table - Krediler/Ödemeler tablosu
    // await db.execAsync(`DROP TABLE IF EXISTS payments;`);
    // await db.execAsync(`DROP TABLE IF EXISTS payment_details;`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,                    -- Kredi/Ödeme Adı
        amount REAL NOT NULL,                  -- Toplam Tutar
        startDate TEXT NOT NULL,               -- Başlangıç Tarihi
        isRecurring INTEGER DEFAULT 0,         -- Taksitli mi? (0: Hayır, 1: Evet)
        installments INTEGER DEFAULT 1,        -- Taksit Sayısı
        description TEXT,                      -- Açıklama
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    // Payment details/installments table - Ödeme detayları/taksitler tablosu
    await db.execAsync(`CREATE TABLE IF NOT EXISTS payment_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paymentId INTEGER NOT NULL,            -- Bağlı olduğu ödeme/kredi ID
        amount REAL NOT NULL,                  -- Taksit Tutarı
        dueDate TEXT NOT NULL,                 -- Vade Tarihi
        isPaid INTEGER DEFAULT 0,              -- Ödendi mi? (0: Hayır, 1: Evet)
        paidDate TEXT,                         -- Ödenme Tarihi
        paymentMethod TEXT,                    -- Ödeme Yöntemi (Nakit, Havale, vs.)
        notes TEXT,                            -- Notlar
        FOREIGN KEY(paymentId) REFERENCES payments(id) ON DELETE CASCADE
    );`);

    console.log('Veritabanı tabloları başarıyla oluşturuldu');
    return db;
};

export const getDatabase = async () => { 
        await setupDatabase();
        return await SQLite.openDatabaseAsync(DB_NAME); 
        // Hata durumunda veritabanını yeniden oluştur
       // return await resetDatabase();
    
};
