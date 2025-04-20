export const paymentCategoriesScripts = () => {
    const tableCreate = `CREATE TABLE IF NOT EXISTS payment_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,                    -- Kategori Adı
        icon TEXT NOT NULL                     -- İkon Adı
    );`;
    const categoryInsert = `INSERT OR IGNORE INTO payment_categories (name, icon) VALUES (?, ?)`;
    const categoryUpdate = `UPDATE payment_categories SET name = ?, icon = ? WHERE id = ?`;
    const categoryDelete = `DELETE FROM payment_categories WHERE id = ?`;
    const categorySelect = `SELECT id,name,icon FROM payment_categories ORDER BY name ASC`;
    const categorySelectById = `SELECT id,name,icon FROM payment_categories WHERE id = ?`;
    return {
        tableCreate,
        categoryInsert,
        categoryUpdate,
        categoryDelete,
        categorySelect,
        categorySelectById
    };
}