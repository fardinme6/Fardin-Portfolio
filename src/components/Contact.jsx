import { useState } from "react";
export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    } else {
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setError("");
      window.location.href =
      `mailto:fardinmehry7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    }
  }
  return (
    <section className="contact panel" id="contact">
      <h2 className="section-title">
        Contact <span>Me</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Full Name
            <input
              type="text"
              value={name}
              placeholder="Your name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
        </div>
        <label>
          Subject
          <input
            type="text"
            name="subject"
            value={subject}
            placeholder="What would you like to discuss?"
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          />
        </label>
        <label>
          Your Message
          <textarea
            name="message"
            rows="4"
            value={message}
            placeholder="Write your message here..."
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></textarea>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn primary submit-btn" type="submit">
          ➤ &nbsp; Send Message
        </button>
      </form>
    </section>
  );
}
