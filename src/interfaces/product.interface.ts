import { JSONContent } from '@tiptap/react';

export interface Color {
	name: string;
	color: string;
	price: number;
}

export interface VariantProduct {
	id: string;
	stock: number;
	price: number;
	storage: string;
	color: string;
	color_name: string;
}

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

export interface PreparedProducts {
	id: string;
	name: string;
	brand: string;
	slug: string;
	features: string[];
	description: JSONContent;
	images: string[];
	created_at: string;
	price: number;
	colors: {
		name: string;
		color: string;
	}[];
	variants: VariantProduct[];
}
