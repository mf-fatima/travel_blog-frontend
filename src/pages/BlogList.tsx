import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import "./BlogList.css";
import api from "../api/axios";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";

const buildImageUrl = (key?: string) => {
  const bucket = import.meta.env.VITE_AWS_BUCKET_NAME;
  const region = import.meta.env.VITE_AWS_REGION;
  if (!key || !bucket || !region) return null;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const { blogs, fetchAllBlogs, loading } = useBlog();

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  const [social, setSocial] = useState<Record<string, { likes: number; liked: boolean; comments: number }>>({});

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const tasks = blogs.map(async (b) => {
          const [likesRes, commentsRes] = await Promise.all([
            api.get(`/blogs/${b._id}/likes`).catch(() => ({ data: { data: { count: (b as any).likesCount || 0, liked: false } } })),
            api.get(`/blogs/${b._id}/comments/count`).catch(() => ({ data: { data: { count: 0 } } })),
          ]);
          return [
            b._id,
            {
              likes: likesRes.data?.data?.count || 0,
              liked: !!likesRes.data?.data?.liked,
              comments: commentsRes.data?.data?.count || 0,
            },
          ] as const;
        });
        const entries = await Promise.all(tasks);
        setSocial(Object.fromEntries(entries));
      } catch {}
    };
    if (blogs.length > 0) loadCounts();
  }, [blogs]);

  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    const msg = localStorage.getItem("toast");
    if (msg) {
      setToast(msg);
      localStorage.removeItem("toast");
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div>
      {toast && (
        <div className="toast-container">
          <div className="toast">{toast}</div>
        </div>
      )}

      {/* -------- FULL WIDTH BANNER (fixed) -------- */}
      <div
        className="bloglist-banner"
        style={{ backgroundImage: "url('/beach1.jpg')" }}
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
        {loading ? (
          <p className="bloglist-empty">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="bloglist-empty">
            No blogs available yet. Be the first to <span>create a post</span>!
          </p>
        ) : (
          <div className="bloglist-grid">
            {blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                {(() => {
                  const url = blog.coverImageUrl || buildImageUrl(blog.coverImage);
                  return url ? (
                    <img src={url} alt={blog.title} className="blog-card-img" />
                  ) : (
                    <div className="blog-card-placeholder">No Image</div>
                  );
                })()}

                <div className="blog-card-content">
                  <Link to={`/blogs/${blog._id}`} className="blog-card-title">{blog.title}</Link>
                  <p className="blog-card-meta">
                    {(blog as any).author?.userName || "Unknown Author"} –{" "}
                    {blog.createdAt ? new Date(blog.createdAt).toDateString() : ""}
                  </p>
                  <p className="blog-card-text">
                    {(() => {
                      const text = stripHtml(blog.content);
                      return text.length > 140 ? text.substring(0, 140) + "..." : text;
                    })()}
                  </p>
                  <div className="card-social-bar">
                    <button
                      className={`social-btn ${social[blog._id]?.liked ? "active" : ""}`}
                      onClick={async () => {
                        try {
                          const res = await api.post(`/blogs/${blog._id}/like`);
                          setSocial((prev) => ({
                            ...prev,
                            [blog._id]: {
                              liked: !!res.data?.data?.liked,
                              likes: res.data?.data?.count || 0,
                              comments: prev[blog._id]?.comments || 0,
                            },
                          }));
                        } catch (err: any) {
                          if (err?.response?.status === 401) {
                            try { localStorage.setItem("toast", "Please login to like posts"); } catch {}
                            navigate("/login");
                          }
                        }
                      }}
                    >
                      <FaRegThumbsUp />
                      <span>{social[blog._id]?.liked ? "Liked" : "Like"}</span>
                      <span className="count">{social[blog._id]?.likes ?? ((blog as any).likesCount || 0)}</span>
                    </button>
                    <Link to={`/blogs/${blog._id}`} className="social-btn">
                      <FaRegComment />
                      <span>Comment</span>
                      <span className="count">{social[blog._id]?.comments ?? 0}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
