import { PaymentCategory } from '@guden-models';
import { getDatabase } from './db';



export const PaymentCategoryService = () => {
    const getCategories = async (): Promise<PaymentCategory[]> => {
        const db = await getDatabase();
        try {
            const query = `SELECT * FROM payment_categories ORDER BY name ASC`;
            const categories = await db.getAllAsync(query);
            return categories as PaymentCategory[];
        } catch (error) {
            console.error('Kategoriler getirilirken hata:', error);
            throw error;
        }
    };

    const addCategory = async (name: string, icon: string): Promise<void> => {
        const db = await getDatabase();
        try {
            const query = `INSERT INTO payment_categories (name, icon) VALUES (?, ?)`;
            await db.execAsync(query, [name, icon]);
        } catch (error) {
            console.error('Kategori eklenirken hata:', error);
            throw error;
        }
    };

    const deleteCategory = async (id: number): Promise<void> => {
        const db = await getDatabase();
        try {
            const query = `DELETE FROM payment_categories WHERE id = ?`;
            await db.execAsync(query, [id]);
        } catch (error) {
            console.error('Kategori silinirken hata:', error);
            throw error;
        }
    };

    return {
        getCategories,
        addCategory,
        deleteCategory,
    };
};