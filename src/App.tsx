import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CustomCursor from "./components/CustomCursor";
import AboutUs from "./components/AboutUs";
import TheData from "./components/TheData";
import MissionStatement from "./components/MissionStatement";
import SdgMarquee from "./components/SdgMarquee";
import OurPrograms from "./components/OurPrograms";
import OurReach from "./components/OurReach";
import OurValues from "./components/OurValues";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

function App() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const onDone = () => setIntroDone(true);
    window.addEventListener("intro:done", onDone);
    return () => window.removeEventListener("intro:done", onDone);
  }, []);

  // lock scrolling while the intro plays
  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  return (
    <main>
      <CustomCursor />
      <div
        style={{
          opacity: introDone ? 1 : 0,
          pointerEvents: introDone ? "auto" : "none",
          transition: "opacity 0.6s ease",
        }}
      >
        <Nav />
      </div>
      <Hero />
      <AboutUs />
      <TheData />
      <MissionStatement />
      <SdgMarquee />
      <OurPrograms />
      <OurReach />
      <OurValues />
      <Testimonials />
      <Faq />
      <Footer />
    </main>
  );
}

export default App;
