import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <Button>
        <Link to="/dashboard">Go to Dashbaord</Link>
      </Button>
    </div>
  );
};

export default HomePage;
