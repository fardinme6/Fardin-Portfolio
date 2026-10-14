import Header from './components/Header.jsx'
import Home from './components/Home.jsx'
import About from './components/About.jsx'
import Projects  from './components/Projects'
import Journey  from './components/Journey'
import Skills  from './components/Skills'
import Contact  from './components/Contact'
import Footer  from './components/Footer'


export default function App() {
  return(
    <>
    <main className="page-grid">
      <section className="hero panel" id="home">
      <Header/>
      <Home/>
      </section>
      <About/>
      <Projects/>
      <Journey/>
      <Skills/>
      <Contact/>
      <Footer/>
    </main>
    </>
  )
}
