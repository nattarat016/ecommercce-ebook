import { supabase } from '../lib/supabase';
import { Product } from '../interfaces';

export const productService = {
    // ดึงข้อมูลสินค้าทั้งหมด
    getAllProducts: async (): Promise<Product[]> => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                variants:product_variants(
                    id,
                    stock,
                    price,
                    storage,
                    color,
                    color_name
                )
            `);

        if (error) {
            throw error;
        }

        return data || [];
    },

    // ดึงข้อมูลสินค้าล่าสุด
    getRecentProducts: async (limit: number = 4): Promise<Product[]> => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                variants:product_variants(
                    id,
                    stock,
                    price,
                    storage,
                    color,
                    color_name
                )
            `)
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
            .select(`
                *,
                variants:product_variants(
                    id,
                    stock,
                    price,
                    storage,
                    color,
                    color_name
                )
            `)
            .order('popularity_score', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        // คำนวณ popularity score จาก view_count และ purchase_count
        const productsWithScore = data?.map(product => ({
            ...product,
            popularity_score: (product.view_count || 0) + ((product.purchase_count || 0) * 5)
        })) || [];

        // เรียงลำดับตาม popularity score จากมากไปน้อย
        return productsWithScore.sort((a, b) => b.popularity_score - a.popularity_score);
    },

    // ดึงข้อมูลสินค้าตาม slug
    getProductBySlug: async (slug: string): Promise<Product | null> => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                variants:product_variants(
                    id,
                    stock,
                    price,
                    storage,
                    color,
                    color_name
                )
            `)
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
            .select(`
                *,
                variants:product_variants(
                    id,
                    stock,
                    price,
                    storage,
                    color,
                    color_name
                )
            `)
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
            .select(`
                *,
                variants:product_variants(
                    id,
                    stock,
                    price,
                    storage,
                    color,
                    color_name
                )
            `)
            .eq('brand', brand);

        if (error) {
            throw error;
        }

        return data || [];
    },

    // Admin Functions
    getProductById: async (id: string): Promise<Product | null> => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                variants:product_variants(
                    id,
                    stock,
                    price,
                    storage,
                    color,
                    color_name
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return data;
    },

    createProduct: async (product: Partial<Product>): Promise<Product> => {
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    },

    updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    },

    deleteProduct: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }
    },

    // เพิ่ม view count
    incrementViewCount: async (productId: string): Promise<void> => {
        const { error } = await supabase
            .rpc('increment_view_count', { product_id: productId });

        if (error) {
            throw error;
        }
    },

    // เพิ่ม purchase count
    incrementPurchaseCount: async (productId: string): Promise<void> => {
        const { error } = await supabase
            .rpc('increment_purchase_count', { product_id: productId });

        if (error) {
            throw error;
        }
    }
}; 