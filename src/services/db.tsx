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
// Loans/Payments table - Krediler/Ödemeler tablosu
// await db.execAsync(`DROP TABLE IF EXISTS payments;`);
// await db.execAsync(`DROP TABLE IF EXISTS payment_details;`);
export const setupDatabase = async () => {
    try {
        if (!dbInstance) {
            dbInstance = await SQLite.openDatabaseAsync(DB_NAME); 
            // Payments table - Krediler/Ödemeler tablosu
            await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS payments (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,                    -- Kredi/Ödeme Adı
                            amount REAL NOT NULL,                  -- Toplam Tutar
                            startDate TEXT NOT NULL,               -- Başlangıç Tarihi
                            isRecurring INTEGER DEFAULT 0,         -- Taksitli mi? (0: Hayır, 1: Evet)
                            installments INTEGER DEFAULT 1,        -- Taksit Sayısı
                            description TEXT,                      -- Açıklama
                            categoryId INTEGER,                   -- Kategori ID
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY(categoryId) REFERENCES payment_categories(id) ON DELETE SET NULL
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

            // Payment categories table - Ödeme kategorileri tablosu
            await dbInstance.execAsync(`CREATE TABLE IF NOT EXISTS payment_categories (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,                    -- Kategori Adı
                            icon TEXT NOT NULL                     -- İkon Adı
                        );`);

            // Varsayılan kategorileri ekle
            const defaultCategories = [
                { name: 'Kredi', icon: 'cash' },
                { name: 'Market', icon: 'cart' },
                { name: 'Fatura', icon: 'receipt' },
                { name: 'Eğlence', icon: 'game-controller' },
                { name: 'Ulaşım', icon: 'car' },
            ];

            for (const category of defaultCategories) {
                await dbInstance.execAsync(
                    `INSERT OR IGNORE INTO payment_categories (name, icon) VALUES (?, ?)`,
                    [category.name, category.icon]
                );
            }

            console.log('Veritabanı tabloları ve varsayılan kategoriler başarıyla oluşturuldu');
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
