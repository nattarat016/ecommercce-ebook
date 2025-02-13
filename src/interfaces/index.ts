export * from './product.interface';

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export interface ShippingAddress {
    email: string;
    phone: string;
    address: string;
    fullName: string;
    province: string;
    postalCode: string;
}

export interface OrderItem {
    id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    price: number;
    product?: Product; // Optional reference to product details
}

export interface Order {
    id: string;
    user_id: string;
    customer_name: string;
    items: OrderItem[];
    shipping_address: ShippingAddress;
    payment_method: string;
    total: number;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id: string;
    color: string;
    color_name: string;
    price: number;
    stock: number;
    storage: string;
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

export interface Product {
    id: string;
    name: string;
    price: number;
    description: ProductDescription;
    brand: string;
    slug: string;
    colors: ProductColor[];
    features: string[];
    images: string[];
    variants: ProductVariant[];
    created_at: string;
    is_popular: boolean;
    view_count: number;
    purchase_count: number;
    popularity_score: number;
}
