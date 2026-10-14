
export default function Skills() {
  return (
    <section className="skills panel" id="skills">
      <h2 className="section-title">
        My <span>Skills</span>
      </h2>

      <div className="skill-columns">
        <div>
          <h3>Programming Languages</h3>

          <div className="skill">
            <div>
              <span className="skill-name">
                HTML &amp; CSS
                <img src="/skills/html.svg" alt="HTML" />
                <img src="/skills/css.svg" alt="CSS" />
              </span>
              <span>95%</span>
            </div>
            <div className="bar">
              <i style={{ width: "95%" }}></i>
            </div>
          </div>

          <div className="skill">
            <div>
              <span className="skill-name">
                JavaScript
                <img src="/skills/javascript.svg" alt="JavaScript" />
              </span>
              <span>80%</span>
            </div>
            <div className="bar">
              <i style={{ width: "80%" }}></i>
            </div>
          </div>

          <div className="skill">
            <div>
              <span className="skill-name">
                React
                <img src="/skills/react.svg" alt="React" />
              </span>
              <span>80%</span>
            </div>
            <div className="bar">
              <i style={{ width: "80%" }}></i>
            </div>
          </div>

          <div className="skill">
            <div>
              <span className="skill-name">
                Dart
                <img src="/skills/dart.svg" alt="Dart" />
              </span>
              <span>88%</span>
            </div>
            <div className="bar">
              <i style={{ width: "88%" }}></i>
            </div>
          </div>

          <div className="skill">
            <div>
              <span className="skill-name">
                Flutter
                <img src="/skills/flutter.svg" alt="Flutter" />
              </span>
              <span>75%</span>
            </div>
            <div className="bar">
              <i style={{ width: "75%" }}></i>
            </div>
          </div>
        </div>

        <div>
          <h3>Tools &amp; Others</h3>

          <div className="skill">
            <div>
              <span className="skill-name">
                Git &amp; GitHub
                <img src="/skills/git.svg" alt="Git" />
                <img src="/skills/github.svg" alt="GitHub" />
              </span>
              <span>80%</span>
            </div>
            <div className="bar">
              <i style={{ width: "80%" }}></i>
            </div>
          </div>

          <div className="skill">
            <div>
              <span className="skill-name">
                VS Code
                <img src="/skills/vscode.svg" alt="VS Code" />
              </span>
              <span>90%</span>
            </div>
            <div className="bar">
              <i style={{ width: "90%" }}></i>
            </div>
          </div>

          <div className="skill">
            <div>
              <span className="skill-name">
                Figma
                <img src="/skills/figma.svg" alt="Figma" />
              </span>
              <span>65%</span>
            </div>
            <div className="bar">
              <i style={{ width: "65%" }}></i>
            </div>
          </div>

          <div className="skill">
            <div>
              <span className="skill-name">
                ICDL
                <img src="/skills/icdl.png" alt="ICDL" />
              </span>
              <span>100%</span>
            </div>
            <div className="bar">
              <i style={{ width: "100%" }}></i>
            </div>
          </div>

          <div className="skill">
            <div>
              <span className="skill-name">
                Photoshop
                <img src="/skills/photoshop.svg" alt="Photoshop" />
              </span>
              <span>85%</span>
            </div>
            <div className="bar">
              <i style={{ width: "85%" }}></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
