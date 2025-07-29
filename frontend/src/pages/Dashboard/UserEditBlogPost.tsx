import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import RichTextEditor from '@/components/blog/rich-text-editor/RichTextEditor';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategoryStore } from '@/store/categoryStore';
import { usePostStore } from '@/store/postStore';

// Enhanced validation schema (same as create)
const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Post title is required.' })
    .min(5, { message: 'Title must be at least 5 characters.' })
    .max(200, { message: 'Title must be less than 200 characters.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
  content: z
    .string()
    .min(20, { message: 'Content must be at least 20 characters.' })
    .max(50000, { message: 'Content is too long.' }),
  image: z.any().optional(),
});

type BlogPostData = z.infer<typeof blogPostSchema>;

const UserEditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm<BlogPostData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      content: '',
      title: '',
      category: '',
    },
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl] = useState<string | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState<boolean>(true);
  // const [isLoadingPost, setIsLoadingPost] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    getAllBlogCategory,
    categories,
    isLoading: categoriesLoading,
  } = useCategoryStore();

  const {
    isLoading,
    editBlogPost,
    getSinglePost,
    currentPost,
    success,
    error,
    clearMessages,
  } = usePostStore();

  // Load categories
  useEffect(() => {
    getAllBlogCategory();
  }, [getAllBlogCategory]);

  //Load post
  useEffect(() => {
    if (id) {
      getSinglePost(id);
    }
  }, [getSinglePost, id]);

  //this is the current post
  //   console.log(currentPost);

  useEffect(() => {
    if (currentPost) {
      form.reset({
        title: currentPost.title || '',
        content: currentPost?.content,
        category: currentPost.category?._id || '',
      });
      // Handle existing image...
    }
  }, [currentPost, form]);

  //   Handle success and error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      clearMessages();
      // Navigate back to posts list or post detail
      navigate('/dashboard/my-posts');
    }
    if (error) {
      toast.error(error);
      clearMessages();
    }
  }, [success, error, clearMessages, navigate]);

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handlePost = async (data: BlogPostData) => {
    if (!id) {
      toast.error('Invalid post ID');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', data.title.trim());
      formData.append('content', data.content);
      formData.append('category', data.category);

      // Handle image logic
      if (selectedImageFile) {
        // New image selected
        formData.append('image', selectedImageFile);
      } else if (keepExistingImage && existingImageUrl) {
        // Keep existing image (you might need to handle this in your backend)
        formData.append('keepExistingImage', 'true');
      } else {
        // Remove image
        formData.append('removeImage', 'true');
      }

      const result = await editBlogPost(id, formData as any);

      if (result?.success) {
        // Success is handled in useEffect
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post. Please try again.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          'Please select a valid image file (JPEG, PNG, GIF, or WebP).'
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setSelectedImageFile(file);
      setKeepExistingImage(false);

      // Create preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      toast.success('New image selected successfully!');
    } else {
      setSelectedImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
  };

  const removeImage = () => {
    setSelectedImageFile(null);
    setKeepExistingImage(false);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const restoreExistingImage = () => {
    setSelectedImageFile(null);
    setKeepExistingImage(true);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/my-posts');
  };

  // Show loading state while fetching post data
  //   if (isLoadingPost) {
  //     return <p>Loading post data...</p>;
  //   }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="mb-2">Edit Blog Post</h1>
        <p className="">Update your post content and settings.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePost)} className="space-y-8">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Title *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter an engaging title for your post"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Write a compelling title that captures your post's essence
                  (5-200 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Selector */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the most relevant category for your post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Featured Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* Existing Image Display */}
                    {existingImageUrl &&
                      keepExistingImage &&
                      !selectedImageFile && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Current image:
                          </p>
                          <div className="relative inline-block">
                            <img
                              src={existingImageUrl}
                              alt="Current featured image"
                              className="w-64 h-40 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={removeImage}
                              className="absolute top-2 right-2"
                              disabled={isLoading}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}

                    {/* New Image Preview */}
                    {imagePreview && selectedImageFile && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          New image preview:
                        </p>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="New image preview"
                            className="w-64 h-40 object-cover rounded-lg border"
                          />
                          <div className="absolute top-2 right-2 space-x-2">
                            {existingImageUrl && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={restoreExistingImage}
                                disabled={isLoading}
                              >
                                Restore
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={removeImage}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* File Input */}
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className="cursor-pointer"
                    />

                    {/* No Image State */}
                    {!existingImageUrl && !imagePreview && (
                      <p className="text-sm text-gray-500">No image selected</p>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a new featured image or keep the existing one. Max
                  size: 5MB. Supported formats: JPG, PNG, GIF, WebP.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Blog Content Editor */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Content *</FormLabel>
                <FormControl>
                  <RichTextEditor
                    {...field}
                    content={field.value}
                    // key={currentPost?._id}
                  />
                </FormControl>
                <FormDescription>
                  Write your blog post content. Minimum 20 characters required.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading || categoriesLoading}
              className="min-w-[140px]"
            >
              {isLoading ? 'Updating Post...' : 'Update Post'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
                restoreExistingImage();
              }}
              disabled={isLoading}
            >
              Reset Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserEditBlogPost;
