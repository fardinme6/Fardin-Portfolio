import { FaGraduationCap, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

export default function About() {
  return (
    <section className="about panel" id="about">
      <div className="about-photo">
        <div className="avatar-ring">
          <div className="avatar-flip">
          <img src="/profile.png" alt="Fardin Mehry" className="about-avatar avatar-front" />
          <img src="/profile2.png" alt="Fardin Mehry" className="about-avatar avatar-back" />
          </div>
        </div>
      </div>

      <div className="about-content">
        <h2 className="section-title">
          About <span>Me</span>
        </h2>
        <p>
          I'm <strong>Fardin Mehry</strong>, a Computer Science student,
          <strong> Web Frontend Developer</strong>, and
          <strong> Mobile App Developer</strong> from Herat, Afghanistan. I
          enjoy building modern, responsive, and user-friendly websites using{" "}
          <strong>HTML, CSS, JavaScript, and React</strong>, as well as
          developing mobile applications with <strong>Dart and Flutter</strong>.
          <br />
          <br />
          I'm passionate about learning new technologies, solving problems, and
          improving my programming skills. My goal is to become a professional
          Software Engineer and create innovative web and mobile applications.
        </p>

        <div className="about-facts">
          <div>
            <span className="fact-icon">
              <FaGraduationCap />
            </span>
            <span>
              Computer Science<small>(Learning)</small>
            </span>
          </div>
          <div>
            <span className="fact-icon">
              <FaMapMarkerAlt />
            </span>
            <span>
              Herat, Afghanistan<small>(Based)</small>
            </span>
          </div>
          <div>
            <span className="fact-icon">
              <FaHeart />
            </span>
            <span>
              Football&nbsp; | &nbsp;Movies&nbsp; | &nbsp;Travel
              <small>(Interests)</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
