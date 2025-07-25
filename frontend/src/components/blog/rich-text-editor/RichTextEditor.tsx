import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { BulletList, OrderedList } from '@tiptap/extension-list';

// define your extension array
const extensions = [
  StarterKit,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'list-disc ml-3',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'list-decimal ml-3',
    },
  }),
  Highlight.configure({
    HTMLAttributes: {
      class: 'my-custom-class',
    },
  }),
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const content = '';

const RichTextEditor = ({ onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions,
    content: content, // Set the initial content with the provided value
    editorProps: {
      attributes: {
        class: 'min-h-[156px] border rounded-md bg-slate-50 py-2 px-3',
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="overflow-y-hidden w-full">
      RichTextEditor
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
