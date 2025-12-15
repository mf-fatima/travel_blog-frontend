
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      {/* Background Video */}
      <div className="video-bg">
        <iframe
          src="https://www.youtube.com/embed/AMqAZ5Iyhpo?autoplay=1&mute=1&controls=0&loop=1&playlist=AMqAZ5Iyhpo&rel=0&modestbranding=1&showinfo=0"
          title="Travel Video"
          frameBorder="0"
          allow="autoplay; fullscreen"
          
        ></iframe>
      </div>

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Hero Content */}
      <div className="hero-content">
        <h1>EXPLORE. DREAM. DISCOVER.</h1>
        <p>
          Discover breathtaking destinations, hidden gems, and unforgettable
          experiences around the globe.
        </p>
        <button className="btn" onClick={() => navigate("/blogs")}>START EXPLORING</button>
      </div>
      
    </section>
  );
};

export default Hero;
