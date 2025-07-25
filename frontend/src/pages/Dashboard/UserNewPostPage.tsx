import { useState, useEffect, useRef } from 'react';
import RichTextEditor from '@/components/blog/rich-text-editor/RichTextEditor';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useAuthToast } from '@/hooks/useAuthToast';
import { useCategoryStore } from '@/store/categoryStore';
import { usePostStore } from '@/store/postStore';

const blogPostSchema = z.object({
  title: z.string().min(1, {
    message: 'Post title is required.',
  }),
  category: z.string().min(1, {
    message: 'Please select a category.',
  }),
  content: z.string().min(20, {
    message: 'Content must be at least 10 characters.',
  }),
  image: z.string().optional(),
});

type BlogPostData = z.infer<typeof blogPostSchema>;

const UserNewPostPage = () => {
  // const [value, setValue] = useState('');

  // const onChange = (content: string) => {
  //   setValue(content);
  //   // console.log(content);
  // };
  const form = useForm<BlogPostData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      content: '',
      title: '',
      category: '',
    },
  });

  // State to hold the selected image file
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to clear the file input

  const { getAllBlogCategory, categories } = useCategoryStore();

  useEffect(() => {
    getAllBlogCategory();
  }, []);

  useAuthToast();

  // console.log(categories.map((cat) => cat.name));

  const { isLoading, createBlogPost, success, error } = usePostStore();

  // function onSubmit(BlogPostData: any) {
  //   console.log(BlogPostData);
  // }

  // console.log(value);

  const handlePost = async (data: BlogPostData) => {
    // await createBlogPost(data);
    // Manually create FormData object to include the file
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);

    // Append the selected image file if available
    if (selectedImageFile) {
      formData.append('image', selectedImageFile); // 'image' must match your backend field name
    }

    // Call the createBlogPost function from your store with FormData
    const result = await createBlogPost(formData);
    console.log('Create Blog attempt (sent via FormData):', formData);

    if (result.success) {
      form.reset(); // Reset text fields managed by react-hook-form
      setSelectedImageFile(null); // Clear image file state
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input element visually
      }
    }
    // console.log(data);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file); // Store the actual File object
    } else {
      setSelectedImageFile(null);
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // Convert file to base64 or handle file upload logic here
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       form.setValue('image', reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className="p-6">
      {/* <RichTextEditor content={value} onChange={onChange} /> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePost)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Write post title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormDescription>
                  Upload an image for your blog post (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Content</FormLabel>
                <FormControl>
                  <RichTextEditor content={''} {...field} />
                </FormControl>
                <FormDescription>
                  Tell a little bit about your blog post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading ? 'Create Post' : 'Creating Post....'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserNewPostPage;
