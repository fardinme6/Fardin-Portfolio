import Admin from "./admin/Admin.jsx";

import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Journey from "./components/Journey.jsx";
import Skills from "./components/Skills.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";

export default function App() {
  if (window.location.pathname.startsWith("/admin")) {
    return <Admin />;
  }

  return (
    <main className="page-grid">
      <section className="hero panel" id="home">
        <Header />
        <Home />
      </section>
      <About />
      <Projects />
      <Journey />
      <Skills />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}