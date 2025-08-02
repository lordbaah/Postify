import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const Hero = () => {
  const { user } = useAuthStore();
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Welcome to Posity
          </h1>
          <p className="text-lg text-gray-600 md:text-xl dark:text-gray-400">
            Your go-to source for insightful articles, tutorials, and stories on
            web development, technology, and more.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row justify-center">
            <Button size="lg">
              <Link to="/blogs">Explore Blogs</Link>
            </Button>
            {!user && (
              <Button variant="outline" size="lg">
                <Link to="/signup">Join Our Community</Link>
              </Button>
            )}
          </div>

          <h1>Testing Deployment on AWS Code build and S3 Hosting</h1>
          <p>fixing cors error on s3</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
