import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import apiInstance from '@/services/api';

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiInstance
      .get('/products/1') // Replace with your API endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log(data);

  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            React + Tailwind CSS + shadcn/ui
          </h1>
          <p className="text-slate-600">
            Your new project is set up and ready for development.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
