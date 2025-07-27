import { useEffect } from 'react';
import { useCommentStore } from '@/store/commentStore';
import { usePostStore } from '@/store/postStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
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

// Infer the TypeScript type from the Zod schema for type safety.
type CommentFormData = z.infer<typeof commentSchema>;

// post id as a props for other components
interface BlogCommentProps {
  postId: string;
}

const BlogComment = ({ postId }: BlogCommentProps) => {
  const {
    createComment,
    deleteComment,
    isLoading: IscommmentLoading,
    error,
    success,
    clearMessages,
  } = useCommentStore();

  const { getSinglePost, currentPostComments } = usePostStore();

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: '',
    },
  });

  const handleCreateComment = async (data: CommentFormData) => {
    // console.log(data.text, postId);

    const result = await createComment(postId, data);
    if (result.success) {
      form.reset();
      // console.log(` ${result.success} ${result.message}`);
      getSinglePost(postId);
    }
  };

  useEffect(() => {
    if (success) {
      toast.success(success);
      clearMessages(); // Clear immediately after showing
    }
    if (error) {
      toast.error(error);
      clearMessages(); // Clear immediately after showing
    }
  }, [success, error, clearMessages]);

  // const handleEditComment = async (data) => {
  //   const result = await editComment(data, postId);
  //   if (result.success) {
  //     //reset form
  //   }
  // };

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
                <FormLabel className="sr-only">Your Comment</FormLabel>{' '}
                {/* Visually hidden label */}
                <FormControl>
                  <Textarea
                    placeholder="Type your comment here..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage /> {/* Displays validation error message */}
              </FormItem>
            )}
          />
          <Button
            disabled={IscommmentLoading}
            type="submit"
            className="w-full sm:w-auto"
          >
            {IscommmentLoading ? 'Posting Comment...' : 'Share comment'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BlogComment;
