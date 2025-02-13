import React from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { Link } from "react-router-dom";

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  editPath?: string;
  idField?: keyof T;
  loading?: boolean;
  error?: string | null;
}

export default function AdminTable<T>({
  data,
  columns,
  onDelete,
  onEdit,
  editPath,
  idField = "id" as keyof T,
  loading,
  error,
}: AdminTableProps<T>) {
  if (loading) return <div className="p-4">กำลังโหลด...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2">
                {column.header}
              </th>
            ))}
            {(onDelete || onEdit || editPath) && (
              <th className="px-4 py-2">การกระทำ</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={String(item[idField])} className="border-b">
              {columns.map((column, index) => (
                <td key={index} className="px-4 py-2">
                  {column.render(item)}
                </td>
              ))}
              {(onDelete || onEdit || editPath) && (
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    {editPath && (
                      <Link
                        to={`${editPath}/${String(item[idField])}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <BiEdit size={20} />
                      </Link>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(String(item[idField]))}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <BiEdit size={20} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(String(item[idField]))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <BiTrash size={20} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
