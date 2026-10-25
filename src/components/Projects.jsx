import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { originalProjects } from "../data/originalProjects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [savedProjects, setSavedProjects] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);

  useEffect(() => {
    const stop = onSnapshot(collection(db, "projects"), (result) => {
      const data = result.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setSavedProjects(data);
    });

    const stopHidden = onSnapshot(
      collection(db, "hiddenProjects"),
      (result) => {
        setHiddenIds(result.docs.map((item) => item.id));
      }
    );

    return () => {
      stop();
      stopHidden();
    };
  }, []);

  // پروژه‌های قدیمی که هنوز به دیتابیس انتقال داده نشده‌اند
  const oldProjects = originalProjects.filter(
    (old) =>
      !hiddenIds.includes(old.id) &&
      !savedProjects.some(
        (project) =>
          project.id === old.id || project.title === old.title
      )
  );

  // ترکیب پروژه‌های قدیمی و جدید
  const projects = [...oldProjects, ...savedProjects];

  return (
    <section className="projects panel" id="projects">
      <h2 className="section-title">
        My <span>Projects</span>
      </h2>

      <p className="section-subtitle">
        A few things I've been building and learning from.
      </p>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            tags={project.tags || []}
          />
        ))}
      </div>
    </section>
  );
}