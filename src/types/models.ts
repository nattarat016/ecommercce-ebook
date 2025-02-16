import { BaseEntity } from './common';

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    BANK_TRANSFER = 'bank_transfer',
    CASH_ON_DELIVERY = 'cod'
}

export interface ShippingAddress {
    email: string;
    phone: string;
    address: string;
    fullName: string;
    province: string;
    postalCode: string;
}

// User interface
export interface User extends BaseEntity {
    email: string;
    full_name: string;
    avatar_url?: string;
    is_admin: boolean;
}

// Product interfaces
export interface ProductVariant extends BaseEntity {
    product_id: string;
    color: string;
    color_name: string;
    price: number;
    stock: number;
    storage?: string;
}

export interface Product extends BaseEntity {
    name: string;
    description?: string;
    brand?: string;
    slug: string;
    price: number;
    features?: string[];
    images?: string[];
    is_popular: boolean;
    view_count: number;
    purchase_count: number;
    popularity_score: number;
    variants?: ProductVariant[];
    colors?: ProductColor[];
}

// Cart interfaces
export interface CartItem extends BaseEntity {
    cart_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    product?: Product;
    variant?: ProductVariant;
}

export interface Cart extends BaseEntity {
    user_id: string;
    items?: CartItem[];
}

// Order interfaces
export interface OrderItem extends BaseEntity {
    order_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    price: number;
    product?: Product;
    variant?: ProductVariant;
}

export interface Order {
    id: string;
    user_id: string;
    customer_name: string;
    total: number;
    status: OrderStatus;
    payment_status: 'pending' | 'paid' | 'failed';
    created_at: string;
    order_items: Array<{
        id: string;
        quantity: number;
        price: number;
        product: {
            id: string;
            title: string;
            brand: string;
        };
        variant: {
            id: string;
            color: string;
            color_name: string;
        };
    }>;
    shipping_address: {
        email: string;
        full_name: string;
        phone: string;
        address: string;
    };
}

export interface ProductColor {
    color: string;
    color_name: string;
}

export type ProductDescription = string | {
    type: string;
    content: Array<{
        type: string;
        content: Array<{
            type: string;
            text: string;
        }>;
    }>;
};

// Form Data Types
export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    brand: string;
    colors: ProductColor[];
    features: string[];
    images: string[];
}

export interface OrderFormData {
    customer_name: string;
    shipping_address: ShippingAddress;
    payment_method: PaymentMethod;
    items: Array<{
        product_id: string;
        variant_id: string;
        quantity: number;
    }>;
} 