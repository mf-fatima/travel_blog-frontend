import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BlogList.css";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  author?: {
    name: string;
  };
}

const mockBlogs: Blog[] = [
  {
    _id: "1",
    title: "Amazing Adventures in Asia",
    content: "Asia is a continent full of wonders...",
    createdAt: new Date().toISOString(),
    author: { name: "John Doe" },
    coverImage: "Top Safari Tips.jpg",
  },
  {
    _id: "2",
    title: "Safari in Africa",
    content: "Experience the wildlife in Africa...",
    createdAt: new Date().toISOString(),
    author: { name: "Jane Smith" },
    coverImage: "africa2.jpg",
  },
  {
    _id: "3",
    title: "European Highlights",
    content: "Europe is full of history and culture...",
    createdAt: new Date().toISOString(),
    author: { name: "Alice Johnson" },
    coverImage: "africa.jpg",
  },
];

const BlogList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>

      {/* -------- FULL WIDTH BANNER (fixed) -------- */}
      <div
        className="bloglist-banner"
        style={{ backgroundImage: "url('/beach.jpg')" }}
      >
        <h1 className="banner-title">BLOG</h1>
        <p className="banner-subtitle">Recent travel blog posts</p>

        <button
          className="btn-create-blog"
          onClick={() => navigate("/blogs/create")}
        >
          Create Blog
        </button>
      </div>

      {/* -------- HEADING BELOW BANNER (as screenshot) -------- */}
      <div className="bloglist-container">
        <h2 className="bloglist-heading">Recent Travel Blog Posts</h2>

        {/* -------- BLOG GRID -------- */}
        {mockBlogs.length === 0 ? (
          <p className="bloglist-empty">
            No blogs available yet. Be the first to <span>create a post</span>!
          </p>
        ) : (
          <div className="bloglist-grid">
            {mockBlogs.map((blog) => (
              <Link key={blog._id} to={`/blogs/${blog._id}`} className="blog-card">
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="blog-card-img"
                  />
                ) : (
                  <div className="blog-card-placeholder">No Image</div>
                )}

                <div className="blog-card-content">
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <p className="blog-card-meta">
                    {blog.author?.name || "Unknown Author"} –{" "}
                    {new Date(blog.createdAt).toDateString()}
                  </p>
                  <p className="blog-card-text">
                    {blog.content.length > 120
                      ? blog.content.substring(0, 120) + "..."
                      : blog.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
