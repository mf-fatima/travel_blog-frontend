import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./BlogPage.css";
import { useAuth } from "../context/authcontext";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  coverImageUrl?: string | null;
  images: string[];
  imagesUrls?: (string | null)[];
  createdAt: string;
  author?: { userName?: string; userEmail?: string; _id?: string };
}

const BlogPage: React.FC = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<{ _id: string; commentText: string; createdAt: string; userId?: { userName?: string } }>>([]);
  const [newComment, setNewComment] = useState<string>("");
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data?.data || res.data);
      } catch (err) {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    const loadSocial = async () => {
      try {
        const likesRes = await api.get(`/blogs/${id}/likes`);
        setLikesCount(likesRes.data?.data?.count || 0);
        setLiked(!!likesRes.data?.data?.liked);
      } catch {}

      try {
        const commentsRes = await api.get(`/blogs/${id}/comments`);
        setComments(Array.isArray(commentsRes.data?.data) ? commentsRes.data.data : []);
      } catch {}
    };
    if (id) loadSocial();
  }, [id]);

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

  if (loading) return <p className="loading">Loading blog...</p>;

  if (!blog)
    return (
      <div className="error">
        <h2>Blog not found</h2>
      </div>
    );

  return (
    <div className="blogpage-container">
      {toast && (
        <div className="toast-container">
          <div className="toast">{toast}</div>
        </div>
      )}

      {/* ======== BANNER WITH COVER IMAGE ======== */}
      <div className="blogpage-banner">
        <img
          src={blog.coverImageUrl || "/travel.jpg"}
          alt={blog.title}
          className="blogpage-banner-img"
        />
        <div className="blogpage-banner-overlay">
          <h1>{blog.title}</h1>
          <p>
            {(blog as any).author?.userName || "Unknown Author"} —{" "}
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

      {/* ======== LIKE & COMMENTS ======== */}
      <div className="blogpage-content-wrapper">
        <div className="blogpage-social">
          <button
            className={`social-btn ${liked ? "active" : ""}`}
            onClick={async () => {
              try {
                const res = await api.post(`/blogs/${blog._id}/like`);
                setLikesCount(res.data?.data?.count || 0);
                setLiked(!!res.data?.data?.liked);
              } catch {}
            }}
          >
            <span>Like</span>
            <span className="count">{likesCount}</span>
          </button>
          <button
            className="social-btn"
            onClick={() => {
              commentInputRef.current?.focus();
              commentInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            <span>Comment</span>
            <span className="count">{comments.length}</span>
          </button>
        </div>

        <div className="comments-section">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newComment.trim()) return;
              try {
                const res = await api.post(`/blogs/${blog._id}/comments`, { commentText: newComment.trim() });
                setComments((prev) => [res.data?.data, ...prev]);
                setNewComment("");
              } catch (err: any) {
                if (err?.response?.status === 401) {
                  try { localStorage.setItem("toast", "Please login to comment"); } catch {}
                  navigate("/login");
                }
              }
            }}
          >
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment"
              ref={commentInputRef}
              className="comment-input"
            />
            <div className="comment-actions">
              <button className="btn" type="submit">Post Comment</button>
            </div>
          </form>

          <div>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="comment-item">
                  <p className="comment-user">{c.userId?.userName || "User"}</p>
                  <p className="comment-date">{new Date(c.createdAt).toLocaleString()}</p>
                  <p className="comment-text">{c.commentText}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ======== GALLERY SECTION ======== */}
      {Array.isArray(blog.imagesUrls) && blog.imagesUrls.length > 0 && (
        <div className="blogpage-gallery-section">
          <h2>Gallery</h2>
          <div className="blogpage-gallery-grid">
            {blog.imagesUrls.map((img, index) => (
              <img
                key={index}
                src={img || `/travel.jpg`}
                alt="Gallery"
                className="blogpage-gallery-img"
              />
            ))}
          </div>
        </div>
      )}

      {(() => {
        const isOwner = !!(
          user &&
          blog.author &&
          (
            (user as any)._id
              ? String((user as any)._id) === String((blog.author as any)._id)
              : user.userEmail === (blog.author as any).userEmail
          )
        );
        return isOwner;
      })() && (
        <div className="blogpage-actions">
          <Link className="btn" to={`/blogs/edit/${blog._id}`}>Update</Link>
          <button className="btn" onClick={async () => {
            try {
              await api.delete(`/blogs/${blog._id}`);
              try { localStorage.setItem("toast", "Blog deleted successfully"); } catch {}
              window.location.href = "/my-blogs";
            } catch {}
          }}>Delete</button>
        </div>
      )}
    </div>
  );
};
// gvhbs
export default BlogPage;
