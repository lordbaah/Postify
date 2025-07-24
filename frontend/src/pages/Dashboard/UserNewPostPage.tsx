import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategoryStore } from '@/store/categoryStore';
import { usePostStore } from '@/store/postStore';

const blosPostSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(2, {
    message: 'about must be at least 2 characters.',
  }),
});

const UserNewPostPage = () => {
  // const [value, setValue] = useState('');

  // const onChange = (content: string) => {
  //   setValue(content);
  //   // console.log(content);
  // };
  const form = useForm<z.infer<typeof blosPostSchema>>({
    resolver: zodResolver(blosPostSchema),
    defaultValues: {
      content: '',
    },
  });

  const { getAllBlogCategory, categories } = useCategoryStore();
  useEffect(() => {
    getAllBlogCategory();
  }, []);

  console.log(categories.map((cat) => cat.name));

  const { isLoading, createBlogPost } = usePostStore();

  function onSubmit(values: z.infer<typeof blosPostSchema>) {
    console.log(values);
  }

  // console.log(value);

  return (
    <div className="p-6">
      {/* <RichTextEditor content={value} onChange={onChange} /> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default UserNewPostPage;
