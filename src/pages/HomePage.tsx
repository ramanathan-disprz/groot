import {Footer, Header, Hero} from '../components/home';

const HomePage: React.FC = () => {
    return (
        <div>
            <Header/>
            <main>
                <Hero/>
            </main>
            <Footer/>
        </div>
    );
};

export default HomePage;
