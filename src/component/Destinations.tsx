 
import { Link } from 'react-router-dom';
import './Destinations.css';

// Travel posts data
const travelPosts = [
  { title: 'Africa', imageSrc: '/africa.jpg' },
  { title: 'America', imageSrc: '/beach.jpg' },
  { title: 'Asia', imageSrc: '/beach1.jpg' },
  { title: 'Europe', imageSrc: '/South Africa Adventure.jpg' },
  { title: 'Middle East', imageSrc: '/Moroccan Markets.jpg' },
  { title: 'Oceania', imageSrc: '/Top Safari Tips.jpg' },
];

const TravelGuides = () => {
  return (
    <div className="travel-guides-container">
      <header className="travel-guides-header">
        <h1>Destinations</h1>
        <p>Pick a country and start exploring!</p>
      </header>

      <div className="travel-posts-grid">
        {travelPosts.map((post, index) => (
          <Link
            key={index}
            to={`/${post.title.toLowerCase().replace(/\s/g, '-')}`}
            className="travel-post-card"
          >
            <div className="travel-post-image-wrapper">
              <img src={post.imageSrc} alt={post.title} />
            </div>
            <p className="travel-post-title">{post.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TravelGuides;
