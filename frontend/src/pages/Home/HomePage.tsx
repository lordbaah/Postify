import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/blog/rich-text-editor/RichTextEditor';

const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <RichTextEditor
        content={''}
        onChange={function (content: string): void {
          throw new Error('Function not implemented.');
        }}
      />

      <Button>
        <Link to="/dashboard">Go to Dashbaord</Link>
      </Button>
    </div>
  );
};

export default HomePage;
