import * as SQLite from 'expo-sqlite';

export const setupDatabase = async () => {
    const db = await SQLite.openDatabaseAsync("loan-tracker.db");
    // error logger
    await db.execAsync(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT, 
        amount REAL, 
        startDate TEXT, 
        isRecurring INTEGER, 
        installments INTEGER
    );`);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS payment_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                paymentId INTEGER, 
                amount REAL, 
                dueDate TEXT, 
                FOREIGN KEY(paymentId) REFERENCES payments(id) ON DELETE CASCADE
            );`);
};
export const getDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('loan-tracker.db');
    setupDatabase();
    return db;
};
