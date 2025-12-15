import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { useAuth } from "../context/authcontext";
import "./BlogList.css";

const MyBlogs: React.FC = () => {
  const { blogs, fetchAllBlogs, fetchMyBlogs, loading } = useBlog();
  const { user } = useAuth();

  useEffect(() => {
    // Try server-side my blogs first
    fetchMyBlogs();
  }, [fetchMyBlogs]);

  useEffect(() => {
    // Fallback: if none loaded, fetch all then filter
    if (!loading && blogs.length === 0) {
      fetchAllBlogs();
    }
  }, [loading, blogs.length, fetchAllBlogs]);

  const filteredBlogs = useMemo(() => {
    if (!user) return blogs;
    return blogs.filter((b: any) => {
      const a = (b as any).author;
      if (!a) return false;
      if (typeof a === "string") {
        return (user as any)._id && String((user as any)._id) === String(a);
      }
      return (user as any)._id
        ? String((user as any)._id) === String(a._id)
        : user.userEmail === a.userEmail;
    });
  }, [blogs, user]);

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
    <div className="bloglist-container" style={{ paddingTop: "100px" }}>
      {toast && (
        <div className="toast-container">
          <div className="toast">{toast}</div>
        </div>
      )}
      <h2 className="bloglist-heading">My Blogs</h2>

      {loading ? (
        <p className="bloglist-empty">Loading blogs...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="bloglist-empty">You have not created any blogs yet.</p>
      ) : (
        <div className="bloglist-grid">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              {(() => {
                const url = (blog as any).coverImageUrl || (blog as any).coverImage || null;
                return url ? (
                  <img src={url} alt={blog.title} className="blog-card-img" />
                ) : (
                  <div className="blog-card-placeholder">No Image</div>
                );
              })()}
              <div className="blog-card-content">
                <h2 className="blog-card-title">
                  <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
