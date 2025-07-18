import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { usePostStore } from '@/store/postStore';
import { useCategoryStore } from '@/store/categoryStore';
import { toast } from 'react-toastify';
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreatePost = () => {
  const { createBlogPost, isLoading, error, success, clearMessages } =
    usePostStore();
  const {
    getAllBlogCategory,
    categories,
    isLoading: catLoading,
    error: catError,
  } = useCategoryStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Simple Tiptap editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  useEffect(() => {
    getAllBlogCategory();
  }, [getAllBlogCategory]);

  // Handle success/error messages from store
  useEffect(() => {
    if (success) {
      toast.success(success);
      // Reset form
      setTitle('');
      setContent('');
      setImage('');
      setSelectedCategory('');
      editor?.commands.clearContent();
      clearMessages();
    }
    if (error) {
      toast.error(error);
      clearMessages();
    }
  }, [success, error, clearMessages, editor]);

  const handleNewPost = async () => {
    if (!title || !content || !selectedCategory) {
      toast.error('Title, content and category are required');
      return;
    }

    const newPostData = {
      title,
      content,
      image: image || null,
      category: selectedCategory,
    };

    await createBlogPost(newPostData);
  };

  // Simple toolbar button component
  const ToolbarButton = ({ onClick, isActive, children, title }) => (
    <Button
      type="button"
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className="h-9 w-9 p-0"
      title={title}
    >
      {children}
    </Button>
  );

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create New Post</h1>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Post Title</label>
        <input
          type="text"
          placeholder="Enter your post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <div className="border rounded-lg overflow-hidden">
          {/* Simple Toolbar */}
          <div className="border-b bg-gray-50 p-3 flex gap-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Editor Content */}
          <div className="min-h-[200px] bg-white">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Image URL Input */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Featured Image URL (Optional)
        </label>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a category</option>
          {catLoading ? (
            <option>Loading categories...</option>
          ) : (
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))
          )}
        </select>
      </div>

      {catError && <p className="text-red-600 text-sm">{catError}</p>}

      {/* Submit Button */}
      <button
        onClick={handleNewPost}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? 'Creating Post...' : 'Create Post'}
      </button>
    </div>
  );
};

export default CreatePost;
