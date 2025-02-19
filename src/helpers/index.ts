import { Product } from '../interfaces';

export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('th-TH', {
		style: 'currency',
		currency: 'THB',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
};

export const prepareProducts = (products: Product[]) => {
		const price = Math.min(...products.map(item => item.price));

		return {
			...products,
			price,
		};
	};
