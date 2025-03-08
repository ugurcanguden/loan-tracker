import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const DB_NAME = "loan-tracker.db";
let dbInstance: any | null = null;

export const resetDatabase = async () => {
    try {
        // Önce mevcut bağlantıyı kapat
        if (dbInstance) {
            await dbInstance.closeAsync();
            dbInstance = null;
        }

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
    try {
        if (!dbInstance) {
            dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
            
            // Loans/Payments table - Krediler/Ödemeler tablosu
            // await db.execAsync(`DROP TABLE IF EXISTS payments;`);
            // await db.execAsync(`DROP TABLE IF EXISTS payment_details;`);

            await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS payments (
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
            await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS payment_details (
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

            // Incomes table - Gelirler tablosu
            await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS incomes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,                    -- Gelir Adı
                amount REAL NOT NULL,                  -- Tutar
                date TEXT NOT NULL,                    -- Tarih
                description TEXT,                      -- Açıklama
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);

            console.log('Veritabanı tabloları başarıyla oluşturuldu');
        }

        // Bağlantıyı test et
        await dbInstance.execAsync("SELECT 1");
        return dbInstance;
    } catch (error) {
        console.error('Veritabanı başlatılırken hata:', error);
        // Hata durumunda mevcut instance'ı temizle
        dbInstance = null;
        throw error;
    }
};

export const getDatabase = async () => {
    if (!dbInstance) {
        return await setupDatabase();
    }
    
    try {
        // Bağlantıyı test et
        await dbInstance.execAsync("SELECT 1");
        return dbInstance;
    } catch (error) {
        // Bağlantı kopmuşsa yeniden oluştur
        console.warn('Veritabanı bağlantısı kopmuş, yeniden bağlanılıyor...');
        dbInstance = null;
        return await setupDatabase();
    }
};
