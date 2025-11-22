import React from 'react';
import './TravelGuides.css'; // Make sure this CSS file exists and has proper styling

// Travel posts data
const travelPosts = [
  { title: 'HOW TO VISIT THE PYRAMIDS IN EGYPT', imageSrc: '/HOW TO VISIT THE PYRAMIDS IN EGYPT.jpg' },
  { title: 'NUSA PENIDA ISLAND GUIDE FOR BALI', imageSrc: '/NUSA PENIDA ISLAND GUIDE FOR BALI.jpg' },
  { title: '22 BEST THINGS TO DO IN JAPAN', imageSrc: '/22 BEST THINGS TO DO IN JAPAN.jpg' },
  { title: '10 THINGS TO DO AT MACHU PICCHU IN PERU', imageSrc: '/10 THINGS TO DO AT MACHU PICCHU IN PERU.jpg' },
  { title: 'HOW TO VISIT PETRA IN JORDAN', imageSrc: '/HOW TO VISIT PETRA IN JORDAN.jpg' },
  { title: '19 BEST WATERFALLS IN INDONESIA', imageSrc: '/19 BEST WATERFALLS IN INDONESIA.jpg' },
  { title: '27 BEST ISLANDS IN INDONESIA', imageSrc: '/27 BEST ISLANDS IN INDONESIA.jpg' },
  { title: '38 BEST THINGS TO DO IN OAHU HAWAII', imageSrc: '/38 BEST THINGS TO DO IN OAHU HAWAII.jpg' },
  { title: 'CORON PALAWAN ISLAND GUIDE', imageSrc: '/CORON PALAWAN ISLAND GUIDE.jpg' },
  { title: 'EL NIDO PALAWAN ISLAND GUIDE', imageSrc: '/EL NIDO PALAWAN ISLAND GUIDE.jpg' },
  { title: 'KOMODO ISLAND GUIDE FOR INDONESIA', imageSrc: '/KOMODO ISLAND GUIDE FOR INDONESIA.jpg' },
  { title: '15 AMAZING WATERFALLS IN ICELAND', imageSrc: '/15 AMAZING WATERFALLS IN ICELAND.jpg' },
  { title: 'ANGKOR WAT GUIDE FOR CAMBODIA', imageSrc: '/ANGKOR WAT GUIDE FOR CAMBODIA.jpg' },
  { title: 'BALI WATERFALL GUIDE & MAP', imageSrc: '/BALI WATERFALL GUIDE & MAP.jpg' },
  { title: '24 BEST THINGS TO DO IN INDONESIA', imageSrc: '/24 BEST THINGS TO DO IN INDONESIA.jpg' },
  { title: 'HOW TO VISIT THE BALI MONKEY FOREST', imageSrc: '/HOW TO VISIT THE BALI MONKEY FOREST.jpg' },
  { title: 'HOW TO VISIT CHICHEN ITZA FROM CANCUN', imageSrc: '/HOW TO VISIT CHICHEN ITZA FROM CANCUN.jpg' },
  { title: 'BAGAN MYANMAR TRAVEL GUIDE', imageSrc: '/BAGAN MYANMAR TRAVEL GUIDE.jpg' },
];

const TravelGuides = () => {
  return (
    <div className="travel-guides-container">
      <header className="travel-guides-header">
        <h1>Travel Guides</h1>
        <p>Popular travel blog posts & guides</p>
      </header>

      <div className="travel-posts-grid">
        {travelPosts.map((post, index) => (
          <a
            key={index}
            href={`/${post.title.toLowerCase().replace(/\s/g, '-')}`}
            className="travel-post-card"
          >
            <div className="travel-post-image-wrapper">
              <img src={post.imageSrc} alt={post.title} /> {/* Image displayed here */}
            </div>
            <p className="travel-post-title">{post.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TravelGuides;
