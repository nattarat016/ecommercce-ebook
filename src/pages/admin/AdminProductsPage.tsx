import { useState } from "react";
import { productService } from "../../services/product.service";
import { Link } from "react-router-dom";
import { Product } from "../../interfaces";
import AdminTable from "../../components/admin/AdminTable";
import { useApiData } from "../../hooks/useApiData";

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: products = [],
    loading,
    error,
    refresh,
  } = useApiData<Product[]>({
    fetchFn: productService.getAllProducts,
    initialData: [],
    errorMessage: "เกิดข้อผิดพลาดในการโหลดสินค้า",
  });

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) return;

    try {
      await productService.deleteProduct(productId);
      refresh();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: "รูปภาพ",
      render: (product: Product) => (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      header: "ชื่อสินค้า",
      render: (product: Product) => product.name,
    },
    {
      header: "ราคา",
      render: (product: Product) => `฿${product.price.toLocaleString()}`,
    },
    {
      header: "สต็อก",
      render: (product: Product) =>
        product.variants.reduce((total, variant) => total + variant.stock, 0),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          เพิ่มสินค้าใหม่
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <AdminTable
        data={filteredProducts}
        columns={columns}
        onDelete={handleDeleteProduct}
        editPath="/admin/products/edit"
        loading={loading}
        error={error}
      />
    </div>
  );
}
