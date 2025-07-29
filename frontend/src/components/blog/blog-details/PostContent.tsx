interface PostContentImageProps {
  content: string;
}

const PostContent = ({ content }: PostContentImageProps) => {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <div
        className="whitespace-pre-wrap leading-7"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default PostContent;
