import React, { useState } from "react";
import PageBottomSection from "../component/PageBottomSection";

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <div className="blogpage-banner page-hero">
        <img src="/beach1.jpg" alt="Contact" className="blogpage-banner-img" />
        <div className="blogpage-banner-overlay">
          <h1>CONTACT</h1>
          <p>Send me your questions, comments, or suggestions!</p>
        </div>
      </div>

      <div className="blogpage-container">
        <div className="blogpage-content-wrapper">
          <article className="blogpage-content">
          <h2>Say Hello</h2>
          <p>
            For collaborations, questions, or media inquiries, reach out by
            email or use the form below.
          </p>
          <p>
            Email: <a href="mailto:hello@worldtravelguy.com">hello@worldtravelguy.com</a>
          </p>

          <form onSubmit={onSubmit} style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
              required
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "100%", padding: "12px", height: "140px", borderRadius: "6px", border: "1px solid #ddd" }}
              required
            />
            <button className="btn" type="submit" style={{ marginTop: "12px" }}>Send</button>
            {submitted && <p style={{ marginTop: "10px", color: "#16a34a" }}>Message sent</p>}
          </form>
          </article>
        </div>
      </div>

      <PageBottomSection />
    </>
  );
};

export default Contact;
