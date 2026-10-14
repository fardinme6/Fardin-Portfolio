import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Home() {
  return (
    <>
      <div className="hero-copy">
        <p className="eyebrow">Hello, I'm</p>
        <h1>Fardin Mehry</h1>
        <h2>Frontend Developer & Mobile App Developer</h2>
        <p className="intro">
          I enjoy creating modern websites and mobile apps using React and
          Flutter. I love solving problems, learning new technologies, and
          building useful projects.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="#projects">
            View My Projects <span>→</span>
          </a>
          <a className="btn outline" href="#contact">
            Contact Me
          </a>
        </div>
        <div className="socials">
          <a
            href="https://github.com/fardinme6/"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/fardin-mehry-93900214b"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="mailto:fardinmehry7@gmail.com"
            aria-label="Email"
            target="_blank"
            rel="noreferrer"
          >
            <MdEmail size={20} />
          </a>
        </div>
      </div>

      <div className="hero-portrait">
        <img src="/profile1.png" alt="Fardin Mehry" className="profile-photo" />
      </div>
    </>
  );
}
