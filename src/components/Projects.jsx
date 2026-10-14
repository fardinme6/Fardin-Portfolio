import ProjectCard from "./ProjectCard.jsx";

export default function Projects() {
  return (
    <section className="projects panel" id="projects">
      <h2 className="section-title">
        My <span>Projects</span>
      </h2>
      <p className="section-subtitle">
        A few things I've been building and learning from.
      </p>

      <div className="project-grid">
        <ProjectCard
          title="Movie Browser"
          description="A responsive movie browsing web app with search, filters and a clean UI. Built with React and modern CSS."
          image="/Movies.png"
          link="https://moviescards.fardinmehry7.workers.dev/"
          tags={["JavaScript", "React", "CSS"]}
        />

        <ProjectCard
          title="Dark Mode Website"
          description="A simple and elegant website with a dark/light mode toggle and smooth transitions using React and CSS."
          image="/DarkMode.png"
          link="#contact"
          tags={["JavaScript", "React", "CSS"]}
        />

        <ProjectCard
          title="Football Players Website"
          description="A personal portfolio website with a clean design, projects, skills and contact section. Built with React, CSS and JavaScript."
          image="/FootballPlayers.png"
          link="#home"
          tags={["JavaScript", "React", "CSS"]}
        />
      </div>
    </section>
  );
}
