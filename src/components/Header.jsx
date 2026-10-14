export default function Header() {
  return (
    <header className="navbar">
      <a className="logo" href="#home">
        <span className="logo-mark">&lt;FM/&gt;</span> 
      </a>
      <nav aria-label="Main navigation">
        <a className="active" href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#journey">Journey</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
