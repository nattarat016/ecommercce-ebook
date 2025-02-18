import { supabase } from '../lib/supabase';

export interface CartItem {
    id: string;
    order_id: string;
    ebook_id: string;
    created_at?: string;
    // Join fields
    Ebooks?: {
        id: string;
        title: string;
        cover_url: string;
        price: number;
        author_id: string;
    };
}

export const cartService = {
    getOrCreateCart: async (userId: string): Promise<string> => {
        try {
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            console.log('Fetching cart for user:', userId);
            

            const { data: existingCart, error: fetchError } = await supabase
                .from('Orders')
                .select('id')
                .eq('user_id', userId)
                .single();

            console.log('Fetch response:', { existingCart, fetchError });

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error fetching cart:', fetchError);
                throw fetchError;
            }

            if (existingCart) {
                return existingCart.id;
            }

            const { data: newCart, error: createError } = await supabase
                .from('Orders')
                .insert({
                    user_id: userId,
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
                Ebooks : ebook_id(
                    id,
                    title,
                    cover_url,
                    price,
                    author_id
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
            .from('Order_Items')
            .update({
                quantity,
                updated_at: new Date().toISOString()
            })
            .eq('id', itemId);

        if (error) throw error;
    },

    removeFromCart: async (itemId: string): Promise<void> => {
        const { error } = await supabase
            .from('Order_Items')
            .delete()
            .eq('id', itemId);

        if (error) throw error;
    },

    clearCart: async (userId: string): Promise<void> => {
        const cartId = await cartService.getOrCreateCart(userId);
        const { error } = await supabase
            .from('Order_Items')
            .delete()
            .eq('cart_id', cartId);

        if (error) throw error;
    },

    getCartItemCount: async (userId: string): Promise<number> => {
        const { count, error } = await supabase
            .from('Order_Items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) throw error;
        return count || 0;
    },

    getCartTotal: async (userId: string): Promise<number> => {
        const { data, error } = await supabase
            .from('Order_Items')
            .select(`
                Ebooks (price)
            `)
            .eq('user_id', userId);

        if (error) throw error;

        return data.reduce((total, item) => {
            const price = item.Ebooks?.[0]?.price || 0;
            return total + price;
        }, 0);
    }
};