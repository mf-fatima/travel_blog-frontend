 
import "./FeaturedSection.css"; // You can define your styles here

const FeaturedSection = () => (
  <div className="featured-section">
    <h2 className="featured-title">Featured</h2>
    <div className="featured-logos">
      <img src="usa.jpg" alt="USA Today" />
      <img src="nbc.jpg" alt="NBC News" />
      <img src="bbc.jpg" alt="BBC Travel" />
      <img src="time.jpg" alt="TIME" />
      <img src="travel.jpg" alt="Travel + Leisure" />
    </div>
    <div className="featured-links">
      <div className="featured-item">
        <img src="TRAVEL BLOG.jpg" alt="Travel Blog" className="featured-img"/>
        <div className="featured-text">TRAVEL BLOG</div>
      </div>
      <div className="featured-item">
        <img src="DESTINATIONS.jpg" alt="Destinations" className="featured-img"/>
        <div className="featured-text">DESTINATIONS</div>
      </div>
      <div className="featured-item">
        <img src="ABOUT1.jpg" alt="About" className="featured-img"/>
        <div className="featured-text">ABOUT</div>
      </div>
    </div>
  </div>
);

export default FeaturedSection;
