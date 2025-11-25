import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './BlogPage.css'; // Import the separate CSS file

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  images: string[];
  createdAt: string;
  author?: {
    name: string;
  };
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

  if (loading) {
    return <p className="loading">Loading blog...</p>;
  }

  if (!blog) {
    return (
      <div className="error">
        <h2>Blog not found</h2>
      </div>
    );
  }

  return (
    <div className="blog-container">
      {/* Title */}
      <h1 className="blog-title">{blog.title}</h1>

      {/* Author + Date */}
      <p className="blog-meta">
        {blog.author?.name} — {new Date(blog.createdAt).toDateString()}
      </p>

      {/* Cover Image */}
      <img
        src={`https://your-s3-bucket/${blog.coverImage}`}
        alt={blog.title}
        className="blog-cover"
      />

      {/* Blog Content */}
      <article className="blog-content">
        {blog.content}
      </article>

      {/* Gallery Images */}
      {blog.images && blog.images.length > 0 && (
        <div className="blog-gallery">
          <h2>Gallery</h2>
          <div className="blog-gallery-grid">
            {blog.images.map((img, index) => (
              <img
                key={index}
                src={`https://your-s3-bucket/${img}`}
                alt="gallery"
                className="blog-gallery-img"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
