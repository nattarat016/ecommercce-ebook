import { supabase } from '../lib/supabase';
import { Product } from '../interfaces';

export const productService = {
    // ดึงข้อมูลสินค้าทั้งหมด
    getAllProducts: async (): Promise<Product[]> => {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            throw error;
        }

        return data || [];
    },

    // ดึงข้อมูลสินค้าล่าสุด
    getRecentProducts: async (limit: number = 4): Promise<Product[]> => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        return data || [];
    },

    // ดึงข้อมูลสินค้ายอดนิยม
    getPopularProducts: async (limit: number = 4): Promise<Product[]> => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_popular', true)
            .limit(limit);

        if (error) {
            throw error;
        }

        return data || [];
    },

    // ดึงข้อมูลสินค้าตาม slug
    getProductBySlug: async (slug: string): Promise<Product | null> => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            throw error;
        }

        return data;
    },

    // ค้นหาสินค้า
    searchProducts: async (query: string): Promise<Product[]> => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${query}%`);

        if (error) {
            throw error;
        }

        return data || [];
    },

    // กรองสินค้าตามแบรนด์
    filterProductsByBrand: async (brand: string): Promise<Product[]> => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('brand', brand);

        if (error) {
            throw error;
        }

        return data || [];
    }
}; 