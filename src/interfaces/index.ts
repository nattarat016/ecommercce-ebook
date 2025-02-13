export * from './product.interface';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: {
        type: string;
        content: Array<{
            type: string;
            content: Array<{
                type: string;
                text: string;
            }>;
        }>;
    };
    brand: string;
    slug: string;
    colors: Array<{ color: string; color_name: string }>;
    features: string[];
    images: string[];
    variants: Array<{
        id: string;
        color: string;
        color_name: string;
        price: number;
        stock: number;
        storage: string;
    }>;
    created_at: string;
    is_popular?: boolean;
}
