import Hero from './Hero';
import RecenPost from './RecenPost';
import usePageTitle from '@/hooks/usePageTitle';

const HomePage = () => {
  usePageTitle('Home');
  return (
    <>
      <Hero />
      <RecenPost />
    </>
  );
};

export default HomePage;
