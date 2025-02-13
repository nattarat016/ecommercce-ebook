import { supabase } from '../lib/supabase';
import { Order, OrderStatus } from '../types/models';
import { CartItem } from './cart.service';
import { cartService } from './cart.service';

export interface CreateOrderInput {
    userId: string;
    items: CartItem[];
    shippingAddress: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        province: string;
        postalCode: string;
    };
    paymentMethod: string;
    total: number;
}

class OrderService {
    // Create new order
    async createOrder(input: CreateOrderInput): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .insert({
                user_id: input.userId,
                customer_name: input.shippingAddress.fullName,
                shipping_address: input.shippingAddress,
                payment_method: input.paymentMethod,
                total: input.total,
                status: OrderStatus.PENDING
            })
            .select()
            .single();

        if (error) throw error;

        // Create order items
        const orderItems = input.items.map(item => ({
            order_id: data!.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.variant?.price || 0
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return data!;
    }

    // Get user orders
    async getUserOrders(userId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(*),
                    variant:product_variants(*)
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Get order details
    async getOrderDetails(orderId: string): Promise<Order | null> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(*)
                )
            `)
            .eq('id', orderId)
            .single();

        if (error) throw error;
        return data;
    }

    // Update order status
    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId);

        if (error) throw error;
    }

    // Get all orders (admin)
    async getAllOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(*),
                    variant:product_variants(*)
                ),
                user:profiles(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    }

    // Get orders by status
    async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(*),
                    variant:product_variants(*)
                ),
                user:profiles(*)
            `)
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Delete order (admin)
    async deleteOrder(orderId: string): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) throw error;
    }

    // Search orders
    async searchOrders(query: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(*)
                )
            `)
            .or(`shipping_address->fullName.ilike.%${query}%,id.eq.${query}`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // สร้างคำสั่งซื้อใหม่
    async createOrderNew(userId: string, shippingAddress: Order['shipping_address']) {
        // 1. ดึงข้อมูลตะกร้าสินค้า
        const cartItems = await cartService.getCartItems(userId);
        const total = await cartService.getCartTotal(userId);

        // 2. เริ่ม transaction
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                total_amount: total,
                status: 'pending',
                shipping_address: shippingAddress,
                payment_status: 'pending'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. สร้าง order items
        const orderItems = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.variant?.price || 0
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // 4. ล้างตะกร้าสินค้า
        await cartService.clearCart(userId);

        return order;
    }

    // อัพเดทสถานะการชำระเงิน
    async updatePaymentStatus(orderId: string, paymentStatus: Order['payment_status']) {
        const { error } = await supabase
            .from('orders')
            .update({ payment_status: paymentStatus })
            .eq('id', orderId);

        if (error) throw error;
    }

    // ยกเลิกคำสั่งซื้อ
    async cancelOrder(orderId: string) {
        const { error } = await supabase
            .from('orders')
            .update({
                status: 'cancelled',
                payment_status: 'failed'
            })
            .eq('id', orderId);

        if (error) throw error;
    }
}

export const orderService = new OrderService(); 