import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { useCategoryStore } from '@/store/categoryStore';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EditIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import DeleteDialogForm from '@/components/common/DeleteDialogForm';
import EditDialogForm from '@/components/common/EditDialogForm';
import type { Category } from '@/types/category';

// Zod schema for category validation
const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Category description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const AdminCategoryManagementPage = () => {
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const {
    createCategory,
    getAllBlogCategory,
    deleteCategory,
    editBlogCategory,
    categories,
    isLoading,
    error,
  } = useCategoryStore();

  // React Hook Form setup
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    getAllBlogCategory();
  }, [getAllBlogCategory]);

  // Form submit handler
  const onSubmit = async (data: CategoryFormData) => {
    try {
      const results = await createCategory({
        name: data.name,
        description: data.description,
      });

      // Reset form on success
      if (results.success) {
        form.reset();
        toast.success(results.message);
      }

      if (error) {
        toast.error(error);
      }

      // Refresh categories list
      await getAllBlogCategory();
    } catch (error) {
      // Error is handled by the store error state and useEffect above
      console.error('Create category error:', error);
    }
  };

  // Delete handlers
  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      const result = await deleteCategory(selectedCategory._id);
      if (result.success) {
        toast.success(
          `Category "${selectedCategory.name}" deleted successfully!`
        );
      }

      if (error) {
        toast.error(error);
      }
      await getAllBlogCategory();
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      // Error is handled by the store error state and useEffect above
      console.error('Delete category error:', error);
    }
  };

  // Edit handlers
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async (data: CategoryFormData) => {
    if (!selectedCategory) return;

    try {
      const result = await editBlogCategory(selectedCategory._id, {
        name: data.name,
        description: data.description,
      });
      if (result.success) {
        toast(result.message);
        toast.success(`Category "${data.name}" updated successfully!`);
      }
      if (error) {
        toast.error(error);
      }
      await getAllBlogCategory();
      setEditDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      // Error is handled by the store error state and useEffect above
      console.error('Edit category error:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-dark mb-2">
          Category Management
        </h1>
        <p className="text-lg text-gray-700 mb-1">
          Manage blog post categories.
        </p>
        <p className="text-sm text-gray-600">This is an admin-only route.</p>
      </div>

      {/* Create Category Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <PlusIcon className="w-5 h-5" />
          Create New Category
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        disabled={isLoading}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? 'Creating...' : 'Create Category'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border">
        {isLoading && categories.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading categories...</p>
          </div>
        ) : (
          <Table>
            <TableCaption>
              {categories.length === 0
                ? 'No categories found. Create your first category above.'
                : `Total: ${categories.length} categories`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Category Description</TableHead>
                <TableHead className="w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No categories available
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {category.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => handleEditClick(category)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="Edit category"
                          disabled={isLoading}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => handleDeleteClick(category)}
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          title="Delete category"
                          disabled={isLoading}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteDialogForm
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        categoryName={selectedCategory?.name || ''}
        isDeleting={isLoading}
      />

      {/* Edit Dialog */}
      <EditDialogForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onConfirm={handleEditConfirm}
        category={selectedCategory}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminCategoryManagementPage;
