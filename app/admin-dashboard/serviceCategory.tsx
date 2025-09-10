"use client";

import { useEffect, useState } from "react";
import {
  CreateServiceCategoryDTO,
  UpdateServiceCategoryDTO,
} from "@/types/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { notification } from "antd";
import {
  createCategory,
  deleteServiceCategory,
  getAllCategories,
  updateServiceCategory,
} from "@/services/serviceCategoryService";

interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export default function AdminServiceCategoriesManagementDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [form, setForm] = useState<{ name: string; description: string; icon: string }>({
    name: "",
    description: "",
    icon: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      setCategories(res.data ?? []);
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Failed to load categories",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create
  const handleCreate = async () => {
    try {
      const dto: CreateServiceCategoryDTO = { ...form };
      await createCategory(dto);
      notification.success({ message: "Created", description: "Category created successfully" });
      setIsCreateOpen(false);
      setForm({ name: "", description: "", icon: "" });
      await loadCategories();
    } catch {
      notification.error({ message: "Error", description: "Failed to create category" });
    }
  };

  // Update
  const handleUpdate = async () => {
    if (!selectedId) return;
    try {
      const dto: UpdateServiceCategoryDTO = {
        categoryId: selectedId,
        name: form.name,
        description: form.description,
        icon: form.icon,
      };
      await updateServiceCategory(selectedId, dto);
      notification.success({ message: "Updated", description: "Category updated successfully" });
      setIsEditOpen(false);
      setForm({ name: "", description: "", icon: "" });
      setSelectedId(null);
      await loadCategories();
    } catch {
      notification.error({ message: "Error", description: "Failed to update category" });
    }
  };

  // Delete
  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteServiceCategory(selectedId);
      notification.success({ message: "Deleted", description: "Category deleted successfully" });
      setIsDeleteOpen(false);
      setSelectedId(null);
      await loadCategories();
    } catch {
      notification.error({ message: "Error", description: "Failed to delete category" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Service Categories</h1>
        <Button onClick={() => setIsCreateOpen(true)}>+ New Category</Button>
      </div>

      {/* Table */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Icon</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2">{c.description ?? "-"}</td>
                    <td className="px-3 py-2">
                      {c.icon ? (
                        <img
                          src={c.icon}
                          alt={c.name}
                          className="w-8 h-8 object-contain inline-block rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedId(c.id);
                          setForm({
                            name: c.name,
                            icon: c.icon,
                            description: c.description ?? "",
                          });
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedId(c.id);
                          setIsDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="space-y-1">
              <Input
                placeholder="Icon URL"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 Bạn có thể lấy icon từ{" "}
                <a
                  href="https://icons8.com/icons/set/png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  Icons8
                </a>{" "}
                rồi chọn <strong>"Copy link to PNG"</strong> để sao chép qua.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              placeholder="Icon URL"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              💡 Bạn có thể lấy icon từ{" "}
              <a
                href="https://icons8.com/icons/set/png"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                Icons8
              </a>{" "}
              rồi chọn <strong>"Copy link to PNG"</strong> để sao chép qua.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
