import { JSONContent } from '@tiptap/react';

export interface BaseColor {
	name: string;
	color: string;
}

export interface Color extends BaseColor {
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

export interface BaseProduct {
	id: string;
	name: string;
	brand: string;
	slug: string;
	price: number;
	features: string[];
	images: string[];
	created_at: string;
}

export interface Product extends BaseProduct {
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
	colors: Array<{ color: string; color_name: string }>;
	variants: VariantProduct[];
	is_popular: boolean;
	view_count: number;
	purchase_count: number;
	popularity_score: number;
}

export interface PreparedProducts extends BaseProduct {
	description: JSONContent;
	colors: BaseColor[];
	variants: VariantProduct[];
}
