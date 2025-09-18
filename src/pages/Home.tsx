import React from "react";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import Footer from "../components/home/Footer";

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
