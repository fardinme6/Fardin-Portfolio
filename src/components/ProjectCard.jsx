export default function ProjectCard({ title, description, image, tags, link }) {
  return (
    <article className="project-card">
      <div className="project-image">
        <img src={image} alt={title} className="project-photo" />
      </div>

      <div className="project-info">
        <h3>{title}</h3>

        <p>{description}</p>

        <div className="tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <a className="btn primary small" href={link} target="_blank">
          View Project <span>→</span>
        </a>
      </div>
    </article>
  );
}
