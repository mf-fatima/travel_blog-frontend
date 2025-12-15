import React from "react";
import PageBottomSection from "../component/PageBottomSection";

const About: React.FC = () => {
  return (
    <>
      <div className="blogpage-banner page-hero">
        <img src="/South Africa Adventure.jpg" alt="About" className="blogpage-banner-img" />
        <div className="blogpage-banner-overlay">
          <h1>ABOUT</h1>
          <p>More about me and this blog</p>
        </div>
      </div>

      <div className="blogpage-container">
        <div className="blogpage-content-wrapper">
          <article className="blogpage-content">
            <h2>Who I Am</h2>
            <p>
              I’m a traveler and photographer sharing practical guides, itineraries,
              and honest tips from real experiences around the world. This site
              focuses on easy planning, safety, and finding scenic places off the
              beaten path.
            </p>

            <h3>What You’ll Find Here</h3>
            <p>
              Destination guides, hiking and adventure advice, cultural highlights,
              budget travel strategies, and photography inspiration. Every post is
              written to help you plan better and enjoy more.
            </p>

            <h3>Travel Philosophy</h3>
            <p>
              I believe travel should be immersive, respectful, and sustainable. The best
              journeys balance iconic sights with quiet moments in nature and authentic
              local experiences.
            </p>

            <h3>Press & Partnerships</h3>
            <p>
              I’ve worked with tourism boards, outdoor brands, and media outlets. Features
              include BBC Travel, NBC News, TIME, and others.
            </p>

            <h3>How I Work</h3>
            <p>
              Clear planning, safety-first advice, and real photography. Every guide is
              field-tested and updated to stay useful.
            </p>

            <h3>Contact & Collaborations</h3>
            <p>
              For media or brand partnerships, reach me via the contact page. I only
              collaborate on projects that are helpful and relevant to readers.
            </p>
          </article>
        </div>
      </div>

      {/* <PageBottomSection /> */}
    </>
  );
};

export default About;
