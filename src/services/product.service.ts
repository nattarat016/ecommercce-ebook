import { supabase } from '../lib/supabase';
import { Product } from '../interfaces';

export const productService = {
    // ดึงข้อมูลสินค้าทั้งหมด
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const { data, error } = await supabase
                .from('Ebooks')
                .select(`*,
                    Categories (
                        name
                    ),
                    Authors:Users(
                        username)`)
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching all products:', error);
                throw error;
            }
            return data || [];
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            throw error;
        }
    },

    // ดึงข้อมูลสินค้าล่าสุด
    getRecentProducts: async (limit: number = 8): Promise<Product[]> => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    variants:product_variants (
                        id,
                        color,
                        color_name,
                        storage,
                        price,
                        stock
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error fetching recent products:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error in getRecentProducts:', error);
            throw error;
        }
    },

    // ดึงข้อมูลสินค้ายอดนิยม
    getPopularProducts: async (limit: number = 8): Promise<Product[]> => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    variants:product_variants (
                        id,
                        color,
                        color_name,
                        storage,
                        price,
                        stock
                    )
                `)
                .order('view_count', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error fetching popular products:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error in getPopularProducts:', error);
            throw error;
        }
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

    // กรองสินค้าตามหมวดหมู่
    filterProductsByCategory: async (categoryName: string): Promise<Product[]> => {
        try {
            const {data:catId,error} = await supabase
                .from('Categories').select('id').eq('name', categoryName).single();
            const { data, error:err } = await supabase
                .from('Ebooks')
                .select('*')
                .eq('category_id', catId?.id);

            if (err) {
                console.error('Error filtering products by category:', error);
                throw error;
            }

            if (err) {
                console.error('Error filtering products by category:', error);
                throw error;
            }
            

            return data || [];
        } catch (error) {
            console.error('Error in filterProductsByCategory:', error);
            throw error;
        }
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