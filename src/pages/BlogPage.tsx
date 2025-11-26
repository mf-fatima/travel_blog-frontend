import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogPage.css";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  images: string[];
  createdAt: string;
  author?: { name: string };
}

const BlogPage: React.FC = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blog/${id}`)
      .then((res) => {
        setBlog(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching blog:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading">Loading blog...</p>;

  if (!blog)
    return (
      <div className="error">
        <h2>Blog not found</h2>
      </div>
    );

  return (
    <div className="blogpage-container">

      {/* ======== BANNER WITH COVER IMAGE ======== */}
      <div
        className="blogpage-banner"
        style={{
          backgroundImage: `url(https://your-s3-bucket/${blog.coverImage})`,
        }}
      >
        <div className="blogpage-banner-overlay">
          <h1>{blog.title}</h1>
          <p>
            {blog.author?.name || "Unknown Author"} —{" "}
            {new Date(blog.createdAt).toDateString()}
          </p>
        </div>
      </div>

      {/* ======== CONTENT SECTION ======== */}
      <div className="blogpage-content-wrapper">
        <article
          className="blogpage-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* ======== GALLERY SECTION ======== */}
      {blog.images.length > 0 && (
        <div className="blogpage-gallery-section">
          <h2>Gallery</h2>
          <div className="blogpage-gallery-grid">
            {blog.images.map((img, index) => (
              <img
                key={index}
                src={`https://your-s3-bucket/${img}`}
                alt="Gallery"
                className="blogpage-gallery-img"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
