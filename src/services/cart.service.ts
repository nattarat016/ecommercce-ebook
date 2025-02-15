import { supabase } from '../lib/supabase';

export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    created_at?: string;
    updated_at?: string;
    // Join fields
    product?: {
        id: string;
        name: string;
        images: string[];
        price: number;
    };
    variant?: {
        id: string;
        color: string;
        color_name: string;
        storage: string;
        price: number;
        stock: number;
    };
}

export const cartService = {
    getOrCreateCart: async (userId: string): Promise<string> => {
        try {
            const { data: existingCart, error: fetchError } = await supabase
                .from('carts')
                .select('id')
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (existingCart) {
                return existingCart.id;
            }

            const { data: newCart, error: createError } = await supabase
                .from('carts')
                .insert({
                    user_id: userId,
                    status: 'active'
                })
                .select('id')
                .single();

            if (createError) throw createError;
            if (!newCart) throw new Error('Failed to create cart');

            return newCart.id;
        } catch (error) {
            console.error('Error in getOrCreateCart:', error);
            throw error;
        }
    },

    getCartItems: async (userId: string): Promise<CartItem[]> => {
        const cartId = await cartService.getOrCreateCart(userId);

        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                *,
                product:products (
                    id,
                    name,
                    images,
                    price
                ),
                variant:product_variants (
                    id,
                    color,
                    color_name,
                    storage,
                    price,
                    stock
                )
            `)
            .eq('cart_id', cartId);

        if (error) throw error;
        return data || [];
    },

    addToCart: async (userId: string, productId: string): Promise<void> => {
        try {
            const cartId = await cartService.getOrCreateCart(userId);

            const { data: existingItem } = await supabase
                .from('cart_items')
                .select('*')
                .eq('cart_id', cartId)
                .single();

            if (existingItem) {
                const { error } = await supabase
                    .from('cart_items')
                    .update({
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingItem.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('cart_items')
                    .insert({
                        cart_id: cartId,
                        product_id: productId,
                    });

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    updateCartItemQuantity: async (itemId: string, quantity: number): Promise<void> => {
        const { error } = await supabase
            .from('cart_items')
            .update({
                quantity,
                updated_at: new Date().toISOString()
            })
            .eq('id', itemId);

        if (error) throw error;
    },

    removeFromCart: async (itemId: string): Promise<void> => {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId);

        if (error) throw error;
    },

    clearCart: async (userId: string): Promise<void> => {
        const cartId = await cartService.getOrCreateCart(userId);
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cartId);

        if (error) throw error;
    },

    getCartItemCount: async (userId: string): Promise<number> => {
        const { count, error } = await supabase
            .from('cart_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) throw error;
        return count || 0;
    },

    getCartTotal: async (userId: string): Promise<number> => {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                quantity,
                variant:product_variants (price)
            `)
            .eq('user_id', userId);

        if (error) throw error;

        return data.reduce((total, item) => {
            const price = item.variant?.[0]?.price || 0;
            return total + (item.quantity * price);
        }, 0);
    }
}; 