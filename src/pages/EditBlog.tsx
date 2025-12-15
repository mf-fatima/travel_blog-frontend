import { useEffect, useState, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCategory } from "../context/CategoryContext";
import "./CreateBlog.css";

const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css";


const EditBlog: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { categories, loading: catLoading, fetchAllCategories } = useCategory();
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreviews.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [coverPreview, galleryPreviews]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        const b = res.data?.data || res.data;
        setTitle(b.title || "");
        setCategory((b.category && (b.category._id || b.category)) || "");
        setTags(Array.isArray(b.tags) ? b.tags.join(", ") : "");
        setContent(b.content || "");
        setMetaTitle(b.metaTitle || "");
        setMetaDescription(b.metaDescription || "");
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (categories.length === 0) {
      fetchAllCategories();
    }
  }, [categories.length, fetchAllCategories]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append("title", title);
      if (category) form.append("category", category);
      form.append("content", content);
      const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
      form.append("tags", JSON.stringify(tagArray));
      if (metaTitle) form.append("metaTitle", metaTitle);
      if (metaDescription) form.append("metaDescription", metaDescription);
      if (coverImage) form.append("coverImage", coverImage);
      galleryImages.forEach((img) => form.append("images", img));
      await api.put(`/blogs/${id}`, form);
      try { localStorage.setItem("toast", "Blog updated successfully"); } catch {}
      navigate(`/blogs/${id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Update failed";
      try { localStorage.setItem("toast", msg); } catch {}
    } finally { setSaving(false); }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCoverImage = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setGalleryImages((prev) => [...prev, ...newFiles]);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const removeGalleryImage = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <div className="bloglist-empty">Loading...</div>;

  return (
    <div className="createblog-wrapper" style={{ paddingTop: "100px" }}>
      <div className="createblog-header">
        <h1>Edit Blog</h1>
        <p>Update your post</p>
      </div>

      <form onSubmit={onSubmit} className="createblog-card">
        <h2 className="section-title">Blog Information</h2>
        <input type="text" placeholder="Blog Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required className="select-input" disabled={catLoading}>
          <option value="">{catLoading ? "Loading categories..." : "Select Category"}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />

        <h2 className="section-title">Content</h2>
        {isClient && (
          <Suspense fallback={<div>Loading editor...</div>}>
            <ReactQuill value={content} onChange={setContent} theme="snow" />
          </Suspense>
        )}

        <h2 className="section-title">SEO Settings</h2>
        <input type="text" placeholder="Meta Title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        <textarea placeholder="Meta Description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />

        <h2 className="section-title">Media Uploads</h2>
        <div className="upload-box">
          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverUpload} />
          {coverPreview && (
            <div className="cover-preview-box">
              <img src={coverPreview} alt="cover preview" className="cover-preview-img" />
              <button type="button" className="remove-cover-btn" onClick={removeCoverImage}>×</button>
            </div>
          )}
        </div>

        <div className="upload-box">
          <label>Gallery Images</label>
          <label className="multi-upload-box" htmlFor="edit-gallery-input">Click to upload multiple images</label>
          <input id="edit-gallery-input" type="file" accept="image/*" multiple className="hidden-input" onChange={handleGalleryUpload} />

          {galleryPreviews.length > 0 && (
            <div className="preview-grid">
              {galleryPreviews.map((src, i) => (
                <div key={i} className="preview-card">
                  <img src={src} alt="preview" className="preview-img" />
                  <button type="button" className="remove-img-btn" onClick={() => removeGalleryImage(i)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="publish-btn" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
};

export default EditBlog;
