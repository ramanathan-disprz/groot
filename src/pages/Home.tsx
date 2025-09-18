import {
  Header,
  Hero,
  Footer
} from '../components/home';

const HomeScreen: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default HomeScreen;
