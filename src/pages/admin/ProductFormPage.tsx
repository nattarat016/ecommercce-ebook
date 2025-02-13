import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/product.service";
import { supabase } from "../../lib/supabase";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  colors: Array<{
    color: string;
    color_name: string;
    storage: string;
    stock: string;
    price: string;
  }>;
  features: string[];
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category: "",
  colors: [],
  features: [],
};

// เพิ่ม constant สำหรับสีและความจุที่กำหนดไว้
const PRESET_COLORS = [
  { color: "#000000", color_name: "ดำ" },
  { color: "#FFFFFF", color_name: "ขาว" },
  { color: "#FF0000", color_name: "แดง" },
  { color: "#0000FF", color_name: "น้ำเงิน" },
  { color: "#008000", color_name: "เขียว" },
];

const PRESET_STORAGES = ["64GB", "128GB", "256GB", "512GB", "1TB"];

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newVariant, setNewVariant] = useState({
    color: "",
    color_name: "",
    storage: "",
    stock: "",
    price: "",
  });
  const [newFeature, setNewFeature] = useState("");

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getProductById(id!);
      if (product) {
        setFormData({
          name: product.name,
          description:
            typeof product.description === "string"
              ? product.description
              : product.description?.content?.[0]?.content?.[0]?.text || "",
          price: product.price.toString(),
          image_url: product.images[0],
          category: product.brand,
          colors: product.variants.map((variant) => ({
            color: variant.color,
            color_name: variant.color_name,
            storage: variant.storage,
            stock: variant.stock.toString(),
            price: variant.price.toString(),
          })),
          features: product.features,
        });
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = () => {
    if (
      !newVariant.color ||
      !newVariant.color_name ||
      !newVariant.storage ||
      !newVariant.stock ||
      !newVariant.price
    )
      return;

    setFormData((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), newVariant],
    }));
    setNewVariant({
      color: "",
      color_name: "",
      storage: "",
      stock: "",
      price: "",
    });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;

    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!formData?.name || !formData?.price || !formData?.colors?.length) {
        throw new Error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      }

      const productData = {
        name: formData.name,
        description: formData.description || "",
        price: parseFloat(formData.price),
        brand: formData.category || "",
        images: formData.image_url ? [formData.image_url] : [],
        features: formData.features || [],
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      };

      // สร้างหรืออัพเดทสินค้า
      let productId = id;
      if (!isEditMode) {
        const { data, error: productError } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (productError) throw productError;
        productId = data.id;
      } else {
        const { error: productError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id);

        if (productError) throw productError;
      }

      if (isEditMode && productId) {
        await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", productId);
      }

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(
          formData.colors.map((variant) => ({
            product_id: productId,
            color: variant.color,
            color_name: variant.color_name,
            storage: variant.storage,
            stock: parseInt(variant.stock),
            price: parseFloat(variant.price),
          }))
        );

      if (variantsError) throw variantsError;

      navigate("/admin/products");
    } catch (err) {
      console.error("Error saving product:", err);
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading && isEditMode) return <div className="p-4">กำลังโหลด...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">ชื่อสินค้า</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">รายละเอียด</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-1">ราคา</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block mb-1">URL รูปภาพ</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">หมวดหมู่</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">ตัวเลือกสินค้า</h3>

          {/* แสดงรายการตัวเลือกที่เพิ่มแล้ว */}
          <div className="space-y-2">
            {formData.colors.map((variant, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 bg-gray-50 p-3 rounded"
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: variant.color }}
                />
                <span>{variant.color_name}</span>
                <span>{variant.storage}</span>
                <span>{variant.stock} ชิ้น</span>
                <span>฿{variant.price}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>

          {/* ฟอร์มเพิ่มตัวเลือกใหม่ */}
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                สี
              </label>
              <select
                value={newVariant.color}
                onChange={(e) => {
                  const selectedColor = PRESET_COLORS.find(
                    (c) => c.color === e.target.value
                  );
                  setNewVariant((prev) => ({
                    ...prev,
                    color: selectedColor?.color || "",
                    color_name: selectedColor?.color_name || "",
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">เลือกสี</option>
                {PRESET_COLORS.map((color) => (
                  <option key={color.color} value={color.color}>
                    {color.color_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ความจุ
              </label>
              <select
                value={newVariant.storage}
                onChange={(e) =>
                  setNewVariant((prev) => ({
                    ...prev,
                    storage: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">เลือกความจุ</option>
                {PRESET_STORAGES.map((storage) => (
                  <option key={storage} value={storage}>
                    {storage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                จำนวน
              </label>
              <input
                type="number"
                value={newVariant.stock}
                onChange={(e) =>
                  setNewVariant((prev) => ({ ...prev, stock: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ราคา
              </label>
              <input
                type="number"
                value={newVariant.price}
                onChange={(e) =>
                  setNewVariant((prev) => ({ ...prev, price: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="0"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                เพิ่มตัวเลือก
              </button>
            </div>
          </div>
        </div>

        {/* Features Management Section */}
        <div className="space-y-2">
          <label className="block mb-1">คุณสมบัติเด่น</label>

          {/* Features List */}
          <div className="space-y-2">
            {formData.features?.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-50 p-2 rounded"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  ลบ
                </button>
              </div>
            )) || []}
          </div>

          {/* Add New Feature */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="เพิ่มคุณสมบัติเด่น"
              className="flex-1 p-2 border rounded"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              เพิ่ม
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </div>
  );
}
