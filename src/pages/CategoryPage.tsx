import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { useCategory } from "../context/CategoryContext";
import "./BlogList.css";

const buildImageUrl = (key?: string) => {
  const bucket = import.meta.env.VITE_AWS_BUCKET_NAME;
  const region = import.meta.env.VITE_AWS_REGION;
  if (!key || !bucket || !region) return null;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs, fetchBlogsByCategory, loading } = useBlog();
  const { categories } = useCategory();

  useEffect(() => {
    if (id) fetchBlogsByCategory(id);
  }, [id, fetchBlogsByCategory]);

  const categoryName = categories.find((c) => c._id === id)?.name || "Category";

  return (
    <div className="bloglist-container" style={{ paddingTop: "100px" }}>
      <h2 className="bloglist-heading">{categoryName} – Posts</h2>

      {loading ? (
        <p className="bloglist-empty">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="bloglist-empty">No blogs found in this category.</p>
      ) : (
        <div className="bloglist-grid">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/blogs/${blog._id}`} className="blog-card">
              {(() => {
                const url = (blog as any).coverImageUrl || buildImageUrl((blog as any).coverImage);
                return url ? (
                  <img src={url} alt={blog.title} className="blog-card-img" />
                ) : (
                  <div className="blog-card-placeholder">No Image</div>
                );
              })()}

              <div className="blog-card-content">
                <h2 className="blog-card-title">{blog.title}</h2>
                <p className="blog-card-meta">
                  {(blog as any).author?.userName || "Unknown Author"}
                  {blog.createdAt ? ` – ${new Date(blog.createdAt).toDateString()}` : ""}
                </p>
                <p className="blog-card-text">
                  {(() => {
                    const t = String(blog.content).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
                    return t.length > 140 ? t.substring(0, 140) + "..." : t;
                  })()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
