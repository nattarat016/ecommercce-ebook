import { supabase } from '../lib/supabase';

export interface CartItem {
    price: number;
    id: string;
    order_id: string;
    ebook_id: string;
    // Join fields
    Ebooks?: {
        id: string;
        title: string;
        cover_url: string; // Changed from 'images' to 'cover_url'
        price: number;
    };
}

export const cartService = {
    getOrCreateCart: async (userId: string): Promise<string> => {
        try {
            const { data: existingCart, error: fetchError } = await supabase
                .from('Orders')
                .select('id')
                .eq('user_id', userId)
                // .eq('status', 'active')
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error fetching cart:', fetchError);
                throw fetchError;
            }
            console.log('Existing cart:', existingCart);

            if (existingCart) {
                console.log('Existing cart:', existingCart);
                return existingCart.id;
            }

            const { data: newCart, error: createError } = await supabase
                .from('Orders')
                .insert({
                    user_id: userId,
                    // status: 'active'
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
            .from('Order_Items')
            .select(`
                *,
                Ebooks (
                    id,
                    title,
                    cover_url,
                    price
                )
            `)
            .eq('order_id', cartId);

        if (error) throw error;
        return data || [];
    },

    addToCart: async (userId: string, productId: string): Promise<void> => {
        try {
            const orderId = await cartService.getOrCreateCart(userId);

            const { data: existingItem } = await supabase
                .from('Order_Items')
                .select('*')
                .eq('order_id', orderId)
                .eq('ebook_id', productId)
                .single();

            if (existingItem) {
                const { error } = await supabase
                    .from('Order_Items')
                    .update({
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingItem.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('Order_Items')
                    .insert({
                        order_id: orderId,
                        ebook_id: productId,
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
                product:products (price)
            `)
            .eq('user_id', userId);

        if (error) throw error;

        return data.reduce((total, item) => {
            const price = item.product?.[0].price || 0;
            return total + (item.quantity * price);
        }, 0);
    }
};