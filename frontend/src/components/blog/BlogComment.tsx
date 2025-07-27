import { useEffect } from 'react';
import { useCommentStore } from '@/store/commentStore';
import { usePostStore } from '@/store/postStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
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
    editComment,
    deleteComment,
    isLoading,
    error,
    success,
    clearMessages,
  } = useCommentStore();

  // const { getSinglePost, currentPost, currentPostComments } = usePostStore();

  // useEffect(() => {
  //   if (postId) getSinglePost(postId);
  // }, [postId]);

  // const form = useForm();
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: '',
    },
  });

  const handleCreateComment = async (data: CommentFormData) => {
    console.log(data.text, postId);

    const result = await createComment(postId, data);
    if (result.success) {
      console.log(result.success);
    }
    if (error) {
      console.log(error);
    }
  };

  // const handleEditComment = async (data) => {
  //   const result = await editComment(data, postId);
  //   if (result.success) {
  //     //reset form
  //   }
  // };

  // const handleDeleteComment = async () => {
  //   await deleteComment(postId);
  // };

  return (
    <div className="mt-8 p-4 border rounded-lg shadow-sm bg-white">
      <p className="mb-4 text-lg font-semibold text-gray-800">
        Have a thought? Share your comment:
      </p>
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
          <Button type="submit" className="w-full sm:w-auto">
            Post Comment
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BlogComment;
