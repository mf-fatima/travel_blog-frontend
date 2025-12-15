import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP, FaTwitter } from "react-icons/fa";
import "./Africa.css";

const sliderImages = [
  "/africa1.jpg",
  "/africa.jpg",
  "/africa3.jpg",
];

const tours = [
  { img: "/public/Egypt Pyramids.jpg", title: "Egypt Pyramids", desc: "Explore the Great Pyramids and the Sphinx." },
  { img: "/public/Safari in Kenya.jpg", title: "Safari in Kenya", desc: "Experience wildlife in the Maasai Mara." },
  { img: "/public/Moroccan Markets.jpg", title: "Moroccan Markets", desc: "Discover the colorful souks of Marrakech." },
  { img: "/public/South Africa Adventure.jpg", title: "South Africa Adventure", desc: "Visit Cape Town, Table Mountain and beaches." },
];

const posts = [
  { img: "/public/Top Safari Tips.jpg", title: "Top Safari Tips" },
  { img: "/public/Best African Beaches.jpg", title: "Best African Beaches" },
  { img: "/public/Food & Culture in Morocco.jpg", title: "Food & Culture in Morocco" },
];

const Africa = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="africa-page">
      {/* Hero Slider */}
      <section className="hero-africa">
        <div className="hero-slider">
          {sliderImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Africa ${index + 1}`}
              className={index === current ? "active" : ""}
            />
          ))}
        </div>
        <div className="overlay">
          <h1>Explore America</h1>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="main-content">
        <div className="content-left">
          <h2>Africa Travel Guide</h2>
          <p>
            Africa is a diverse continent with amazing wildlife, landscapes, and cultures. From the Sahara Desert to lush rainforests, there is something for everyone. Travelers can witness majestic wildlife on safaris, explore ancient historical sites, and immerse themselves in vibrant local traditions. The continent is home to over 50 countries, each offering unique experiences, from the bustling cities of Johannesburg and Cairo to the serene beaches of Zanzibar and Seychelles. Africa's natural wonders, including Victoria Falls, the Nile River, and the Serengeti plains, provide unforgettable adventures for explorers, photographers, and nature enthusiasts alike. Whether seeking adventure, relaxation, or cultural discovery, Africa promises memories that last a lifetime.
          </p>

          <h3>Flights</h3>
          <p>
            Main airports include Cairo (CAI), Nairobi (NBO), and Johannesburg (JNB), which connect to most major cities worldwide. Many airlines offer direct and connecting flights, making it easy to plan trips across Africa.
          </p>

          <h3>Safety</h3>
          <p>
            Stay aware of your surroundings, avoid crowded or isolated areas, especially at night. Keep belongings secure, follow local advice, and consider travel insurance for peace of mind.
          </p>

          <h3>Climate</h3>
          <p>
            Africa has tropical, desert, and savanna climates depending on the region. Northern Africa is mostly arid, Central/Western Africa is tropical and humid, while Southern Africa enjoys warm summers and mild winters. Check seasonal weather before planning trips.
          </p>
        </div>



        <div className="content-right">
          {/* About Me */}
          <div className="sidebar-section about-me">
            <h4>About Me</h4>
            <img src="/about.jpg" alt="About" />
            <p>
              Hey! I'm <strong>David Leiter</strong>, a travel enthusiast exploring Africa's hidden gems. Join me on my journey!
            </p>
          </div>

          {/* Quick Facts */}
          <div className="sidebar-section quick-facts-sidebar">
            <h4>Quick Facts</h4>
            <ul>
              <li><strong>Language:</strong> English, French, Arabic</li>
              <li><strong>Currency:</strong> EGP, ZAR, NGN</li>
              <li><strong>Visa:</strong> Varies by country</li>
              <li><strong>Power Plugs:</strong> Type C/D/G/M</li>
            </ul>
          </div>

          {/* Social */}
          <div className="sidebar-section social">
            <h4>Social</h4>
            <ul className="social-links">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF className="social-icon" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="social-icon" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="social-icon" /> YouTube
                </a>
              </li>
              <li>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                  <FaPinterestP className="social-icon" /> Pinterest
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="social-icon" /> Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="tours">
        <h3>Top Tours</h3>
        <div className="tour-cards">
          {tours.map((tour, idx) => (
            <div key={idx} className="tour-card">
              <img src={tour.img} alt={tour.title} />
              <h4>{tour.title}</h4>
              <p>{tour.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Posts Section */}
      <section className="posts">
        <h3>Latest Posts</h3>
        <div className="post-cards">
          {posts.map((p, idx) => (
            <div key={idx} className="post-card">
              <img src={p.img} alt={p.title} />
              <h4>{p.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      {/* <footer>
        <p>&copy; 2025 Africa Travel. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default Africa;
