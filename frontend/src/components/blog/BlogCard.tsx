import { Link } from 'react-router-dom';
export interface Category {
  _id: string;
  name: string;
}

interface cardContentProps {
  _id: string;
  title: string;
  blogCategory: string;
}
const BlogCard = ({ _id, title, blogCategory }: cardContentProps) => {
  return (
    <article className="rounded-lg border border-gray-100 bg-white shadow-xs">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        className="h-56 w-full object-cover"
      />
      <h1 className="text-lg font-medium text-gray-900">{title}</h1>

      <div className="mt-4 flex flex-wrap gap-1">
        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600">
          {blogCategory || ''}
        </span>

        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600">
          JavaScript
        </span>
      </div>

      <Link
        to={`/blogs/${_id}`}
        className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600"
      >
        Find out more
        <span
          aria-hidden="true"
          className="block transition-all group-hover:ms-0.5 rtl:rotate-180"
        >
          &rarr;
        </span>
      </Link>
    </article>
  );
};

export default BlogCard;
