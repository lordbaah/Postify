import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock data for recent blog posts
const recentPosts = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    description:
      'Learn the new features and how to set up your first project with Next.js 15.',
    date: 'July 25, 2025',
    slug: 'getting-started-nextjs-15',
  },
  {
    id: '2',
    title: 'Mastering Tailwind CSS for Responsive Design',
    description:
      'Dive deep into Tailwind CSS utilities to build beautiful and responsive UIs.',
    date: 'July 20, 2025',
    slug: 'mastering-tailwind-css',
  },
  {
    id: '3',
    title: 'The Power of Server Components in React',
    description:
      'Understand how React Server Components can revolutionize your web applications.',
    date: 'July 15, 2025',
    slug: 'power-of-server-components',
  },
];

const RecenPost = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Recent Posts
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Catch up on our latest articles and stay informed.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {recentPosts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{post.description}</p>
              </CardContent>
              <CardFooter>
                {/* <Button asChild variant="link" className="px-0">
                  <Link to={`/blogs/${post.slug}`}>Read More</Link>
                </Button> */}
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/blogs">View All Blogs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecenPost;
