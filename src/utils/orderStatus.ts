import { OrderStatus } from '../types/models';

export const getStatusColor = (status: OrderStatus): string => {
    const colors = {
        [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
        [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800",
        [OrderStatus.SHIPPED]: "bg-purple-100 text-purple-800",
        [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
        [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
    };
    return colors[status];
};

export const getStatusText = (status: OrderStatus): string => {
    const texts = {
        [OrderStatus.PENDING]: "รอดำเนินการ",
        [OrderStatus.PROCESSING]: "กำลังดำเนินการ",
        [OrderStatus.SHIPPED]: "จัดส่งแล้ว",
        [OrderStatus.DELIVERED]: "ส่งถึงแล้ว",
        [OrderStatus.CANCELLED]: "ยกเลิก",
    };
    return texts[status];
}; 