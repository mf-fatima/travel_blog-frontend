import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface BlogItem {
  _id: string;
  title: string;
  createdAt?: string;
  author?: { userName?: string };
  metaTitle?: string;
  metaDescription?: string;
}

interface CategoryItem { _id: string; name: string; slug?: string; description?: string }
interface UserItem { _id: string; userName?: string; userEmail?: string }

const AdminDashboard = () => {
  const [tab, setTab] = useState<"blogs" | "pending" | "categories" | "users" | "seo">("blogs");

  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [pending, setPending] = useState<BlogItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [seoBlogs, setSeoBlogs] = useState<BlogItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState("");

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const [seoBlogId, setSeoBlogId] = useState<string>("");
  const [seoCategoryId, setSeoCategoryId] = useState<string>("");
  const [seoTitle, setSeoTitle] = useState<string>("");
  const [seoDesc, setSeoDesc] = useState<string>("");

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/all").catch(async () => api.get("/blogs"));
      const data = res.data?.data?.blogs ?? res.data?.blogs ?? res.data ?? [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const loadPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/pending");
      const data = res.data?.data ?? res.data ?? [];
      setPending(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load pending blogs");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/categories");
      const list = res.data?.data ?? res.data ?? [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/users/all-users");
      const list = res.data?.data ?? res.data ?? [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
    loadPending();
    loadCategories();
    loadUsers();
  }, []);

  useEffect(() => {
    if (!seoCategoryId) {
      setSeoBlogs(blogs);
      return;
    }
    const loadByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/blogs/category/${seoCategoryId}`);
        const data = res.data?.data ?? res.data ?? [];
        setSeoBlogs(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load category blogs");
        setSeoBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    loadByCategory();
  }, [seoCategoryId, blogs]);

  const onDeleteBlog = async (id: string) => {
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const approveBlog = async (id: string) => {
    try {
      await api.put(`/admin/approve/${id}`);
      setPending((p) => p.filter((b) => b._id !== id));
      await loadBlogs();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Approve failed");
    }
  };

  const rejectBlog = async (id: string) => {
    try {
      await api.put(`/admin/reject/${id}`);
      setPending((p) => p.filter((b) => b._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Reject failed");
    }
  };

  const createCategory = async () => {
    try {
      await api.post("/categories", { name: newCatName, description: newCatDesc });
      setNewCatName("");
      setNewCatDesc("");
      await loadCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Create category failed");
    }
  };

  const updateCategory = async (id: string, name: string, description: string) => {
    try {
      await api.put(`/categories/${id}`, { name, description });
      await loadCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Update category failed");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      await loadCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete category failed");
    }
  };

  const applySeo = async () => {
    if (!seoBlogId) return alert("Select a blog first");
    try {
      await api.put(`/blogs/${seoBlogId}`, { metaTitle: seoTitle, metaDescription: seoDesc });
      setSeoTitle("");
      setSeoDesc("");
      await loadBlogs();
      alert("SEO updated");
    } catch (err: any) {
      alert(err?.response?.data?.message || "SEO update failed");
    }
  };

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: "#9ca3af" }}>Manage content and users</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, minWidth: 420 }}>
          <div style={{ background: "#111827", color: "#e5e7eb", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Blogs</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{blogs.length}</div>
          </div>
          <div style={{ background: "#111827", color: "#e5e7eb", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Pending</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{pending.length}</div>
          </div>
          <div style={{ background: "#111827", color: "#e5e7eb", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Categories</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{categories.length}</div>
          </div>
          <div style={{ background: "#111827", color: "#e5e7eb", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Users</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{users.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["blogs","pending","categories","users","seo"] as const).map((t) => (
          <button
            key={t}
            className="btn"
            style={{ background: tab === t ? "#111827" : "#374151" }}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {tab === "blogs" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              placeholder="Search by title"
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          {blogs.length === 0 ? (
            <p>No blogs found.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {blogs
                .filter((b) => (blogSearch ? b.title.toLowerCase().includes(blogSearch.toLowerCase()) : true))
                .map((b) => (
                  <div key={b._id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", borderBottom: "1px solid #e5e7eb", padding: "12px 0" }}>
                    <div>
                      <Link to={`/blogs/${b._id}`} style={{ color: "#111827", textDecoration: "none", fontWeight: 600 }}>{b.title}</Link>
                      <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                        {(b.author?.userName) || "Unknown"} · {b.createdAt ? new Date(b.createdAt).toDateString() : ""}
                      </div>
                    </div>
                    <Link to={`/blogs/edit/${b._id}`} className="btn" style={{ textAlign: "center" }}>Edit</Link>
                    <button className="btn" onClick={() => onDeleteBlog(b._id)}>Delete</button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {tab === "pending" && (
        <div>
          {pending.length === 0 ? (
            <p>No pending blogs.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {pending.map((b) => (
                <div key={b._id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", borderBottom: "1px solid #e5e7eb", padding: "12px 0" }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{b.title}</span>
                    <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      {(b.author?.userName) || "Unknown"} · {b.createdAt ? new Date(b.createdAt).toDateString() : ""}
                    </div>
                  </div>
                  <button className="btn" onClick={() => approveBlog(b._id)}>Approve</button>
                  <button className="btn" onClick={() => rejectBlog(b._id)}>Reject</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "categories" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input placeholder="Name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
            <input placeholder="Description" value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} />
            <button className="btn" onClick={createCategory}>Add</button>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {categories.map((c) => (
              <div key={c._id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", borderBottom: "1px solid #e5e7eb", padding: "8px 0" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>{c.slug}</div>
                </div>
                <button className="btn" onClick={() => updateCategory(c._id, prompt("New name", c.name) || c.name, prompt("New description", c.description || "") || "")}>Edit</button>
                <button className="btn" onClick={() => deleteCategory(c._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div style={{ display: "grid", gap: 12 }}>
          {users.map((u) => (
            <div key={u._id} style={{ display: "grid", gridTemplateColumns: "1fr", borderBottom: "1px solid #e5e7eb", padding: "8px 0" }}>
              <div style={{ fontWeight: 600 }}>{u.userName || "Unknown"}</div>
              <div style={{ color: "#6b7280" }}>{u.userEmail || ""}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "seo" && (
        <div>
          <div style={{ display: "grid", gap: 8, maxWidth: 700 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <select value={seoCategoryId} onChange={(e) => setSeoCategoryId(e.target.value)}>
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <select value={seoBlogId} onChange={(e) => setSeoBlogId(e.target.value)}>
                <option value="">Select blog</option>
                {(seoCategoryId ? seoBlogs : blogs).map((b) => (
                  <option key={b._id} value={b._id}>{b.title}</option>
                ))}
              </select>
            </div>
            <input placeholder="Meta Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            <textarea placeholder="Meta Description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} />
            <button className="btn" onClick={applySeo}>Save SEO</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
