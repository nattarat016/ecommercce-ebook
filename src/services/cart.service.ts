import { supabase } from '../lib/supabase';

export interface CartItem {
    id: string;
    product_id: string;
    user_id: string;
    quantity: number;
    variant_id: string;
    product?: any; // จะถูก join กับข้อมูลสินค้า
}

export const cartService = {
    // ดึงรายการสินค้าในตะกร้า
    getCartItems: async (userId: string) => {
        const { data, error } = await supabase
            .from('carts')
            .select(`
        *,
        product:products(*)
      `)
            .eq('user_id', userId);

        if (error) throw error;
        return data as CartItem[];
    },

    // เพิ่มสินค้าลงตะกร้า
    addToCart: async (userId: string, productId: string, variantId: string, quantity: number = 1) => {
        const { data, error } = await supabase
            .from('carts')
            .upsert({
                user_id: userId,
                product_id: productId,
                variant_id: variantId,
                quantity: quantity
            }, {
                onConflict: 'user_id,product_id,variant_id'
            })
            .select();

        if (error) throw error;
        return data;
    },

    // อัพเดทจำนวนสินค้าในตะกร้า
    updateQuantity: async (cartId: string, quantity: number) => {
        const { data, error } = await supabase
            .from('carts')
            .update({ quantity })
            .eq('id', cartId)
            .select();

        if (error) throw error;
        return data;
    },

    // ลบสินค้าออกจากตะกร้า
    removeFromCart: async (cartId: string) => {
        const { error } = await supabase
            .from('carts')
            .delete()
            .eq('id', cartId);

        if (error) throw error;
    },

    // ล้างตะกร้าทั้งหมด
    clearCart: async (userId: string) => {
        const { error } = await supabase
            .from('carts')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
    }
}; 