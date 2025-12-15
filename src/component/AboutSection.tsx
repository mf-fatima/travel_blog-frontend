import "./AboutSection.css";

const AboutSection = () => (
  <div className="about-section">
    <div className="about-image">
      <img src="man.jpg" alt="Travel portrait" />
    </div>
    <div className="about-content">
      <h2>Thanks For Looking!</h2>
      <p>
        I'm <strong>David Leiter</strong>, the guy behind this website. I'm an American who's been traveling the world full time for 9 years now.
      </p>
      <p>
        I started this travel blog in 2019 to document my own international trips, share my photos, and help others learn how to travel the world and find some really good spots off the beaten path.
      </p>
      <p>
        All of the writing and pictures on this site come from my own personal experience.
      </p>
      <p>
        My second home is <span style={{ color: "#fc7b53" }}>Bali, Indonesia</span>, where I met my wife Intan, who's a Bali local. Now she joins me on these adventures too.
      </p>
      <p>
        Together, we've done some <span style={{ color: "#fc7b53" }}>bucket list hikes</span>, climbed active <span style={{ color: "#fc7b53" }}>volcanoes</span>, seen exotic <span style={{ color: "#fc7b53" }}>wildlife</span>, and visited some spectacular <span style={{ color: "#fc7b53" }}>castles</span>, <span style={{ color: "#fc7b53" }}>temples</span>, and <span style={{ color: "#fc7b53" }}>monuments</span> around the world.
      </p>
      <p>
        I've worked with and been featured by <span style={{ color: "#fc7b53" }}>BBC Travel</span>, <span style={{ color: "#fc7b53" }}>NBC News</span>, <span style={{ color: "#fc7b53" }}>Time</span>, and other companies.
      </p>
      <p>
        I haven’t been everywhere, but it’s on my list. I hope this world travel blog can help and inspire you in your own journeys as well!
      </p>
      <button className="about-btn">MORE ABOUT ME ➞</button>
    </div>
  </div>
);

export default AboutSection;
