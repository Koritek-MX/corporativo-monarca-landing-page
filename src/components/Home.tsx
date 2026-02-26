import WhatsAppButton from "../components/common/WhatsAppButton";
import Experience from "../components/sections/Experience";
import Services from "../components/sections/Services";
import Contact from "../components/sections/Contact";
import AboutUs from "../components/sections/AboutUs";
import LandingSplash from "./common/LandingSplash";
import Cases from "../components/sections/Cases";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Blog from "../components/sections/Blog";
import { useState } from "react";

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <LandingSplash>
                <Navbar open={menuOpen} setOpen={setMenuOpen} />
                <main>
                    <Hero />
                    <Services />
                    <Experience />
                    <Cases />
                    <AboutUs />
                    <Blog />
                    <Contact />
                </main>
                <Footer />
                <WhatsAppButton hidden={menuOpen} />
            </LandingSplash>
        </>
    );
};

export default Home;