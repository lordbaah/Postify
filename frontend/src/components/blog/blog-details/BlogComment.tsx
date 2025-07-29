import { useEffect } from 'react';
import { useCommentStore } from '@/store/commentStore';
import { usePostStore } from '@/store/postStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const commentSchema = z.object({
  text: z
    .string()
    .min(1, { message: 'Comment cannot be empty.' })
    .max(2000, { message: 'Comment is too long (max 2000 characters).' }),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface BlogCommentProps {
  postId: string;
}

const BlogComment = ({ postId }: BlogCommentProps) => {
  const { createComment, isCreating, success, error, clearMessages } =
    useCommentStore();

  const { getSinglePost } = usePostStore();

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  });

  const handleCreateComment = async (data: CommentFormData) => {
    const result = await createComment(postId, data);
    if (result.success) {
      form.reset();
      getSinglePost(postId);
    }
  };

  useEffect(() => {
    if (success) {
      toast.success(success);
      clearMessages();
    }
    if (error) {
      toast.error(error);
      clearMessages();
    }
  }, [success, error, clearMessages]);

  return (
    <div className="mt-8 p-4 border rounded-lg shadow-sm">
      <h2 className="mb-4">Have a thought? Share your comment:</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateComment)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Your Comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your comment here..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isCreating}
            type="submit"
            className="w-full sm:w-auto"
          >
            {isCreating ? 'Posting Comment...' : 'Share comment'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BlogComment;
