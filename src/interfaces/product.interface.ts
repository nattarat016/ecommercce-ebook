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
	format: string; // Changed from 'storage' to 'format'
	color: string;
	color_name: string;
}

export interface BaseProduct {
	id: string;
	title: string;
	author_id: number; // Changed from 'name' to 'author_id'
	category_id: number | null; // Added category_id
	cover_url: string; // Changed from 'images' to 'cover_url'
	price: number;
	features: string[]; // Assuming features are still relevant
	created_at: string;
	published_at: string; // Added published_at
	file_url: string; // Added file_url
}

export interface Product extends BaseProduct {
	description: string; // Changed to string
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
