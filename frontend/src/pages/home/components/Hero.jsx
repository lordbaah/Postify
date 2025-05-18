import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-12">
      <div className="custom-container px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Discover Positive Insights for Everyday Life
          </h1>
          <p className="text-lg">
            Join our community of readers and writers sharing stories that
            inspire, educate, and uplift.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button>
              Start Reading
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button>Become a Writer</Button>
          </div>
        </div>
        <div className="flex-1">
          <img
            src="/placeholder.svg?height=400&width=500"
            alt="Posity Blog"
            className="rounded-lg w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
