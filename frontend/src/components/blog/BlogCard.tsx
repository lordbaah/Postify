import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageIcon } from 'lucide-react';
export interface Category {
  _id: string;
  name: string;
}

interface cardContentProps {
  _id: string;
  title: string;
  blogCategory: string;
  image?: string;
}
const BlogCard = ({ _id, title, blogCategory, image }: cardContentProps) => {
  return (
    <Card className="pt-0">
      {/* Image Section */}
      <div className="relative h-56 w-full bg-muted">
        {image ? (
          <img
            alt={title}
            src={image}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}
      </div>
      <CardHeader>
        <h3 className="line-clamp-2">{title}</h3>
      </CardHeader>

      <CardContent>
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-600 hover:bg-purple-200"
        >
          {blogCategory}
        </Badge>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          to={`/blogs/${_id}`}
          className="group/link inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Find out more
          <span
            aria-hidden="true"
            className="block transition-all group-hover/link:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
