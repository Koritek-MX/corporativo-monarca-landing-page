import WhatsAppButton from "./components/common/WhatsAppButton";
import Experience from "./components/sections/Experience";
import Services from "./components/sections/Services";
import Contact from "./components/sections/Contact";
import Cases from "./components/sections/Cases";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Blog from "./components/sections/Blog";
import FAQ from "./components/sections/FAQ";


export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Experience />
        <Cases />
        <FAQ />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}