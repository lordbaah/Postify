import Hero from './components/Hero';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

const Home = () => {
  return (
    <>
      <Hero />

      <main>
        <section>
          <h1>Hello</h1>
        </section>
      </main>
    </>
  );
};

export default Home;
