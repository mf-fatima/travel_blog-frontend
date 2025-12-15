import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { useCategory } from "../context/CategoryContext";
import "./CreateBlog.css";

// Lazy load ReactQuill client-side
const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css";


const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // category _id
  const { categories, loading: catLoading, fetchAllCategories } = useCategory();
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  const navigate = useNavigate();
  const { createBlog, loading, error } = useBlog();

  // Enable ReactQuill only on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure categories loaded (uses shared CategoryContext like Navbar)
  useEffect(() => {
    if (categories.length === 0) {
      fetchAllCategories();
    }
  }, [categories.length, fetchAllCategories]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreviews.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [coverPreview, galleryPreviews]);

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

    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const removeGalleryImage = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!category) {
      alert("Please select a category");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("category", category);
    form.append("content", content);

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    form.append("tags", JSON.stringify(tagArray));

    if (metaTitle) form.append("metaTitle", metaTitle);
    if (metaDescription) form.append("metaDescription", metaDescription);
    if (coverImage) form.append("coverImage", coverImage);

    galleryImages.forEach((img) => form.append("images", img));

    try {
      const success = await createBlog(form);
      if (success) {
        try { localStorage.setItem("toast", "Blog created successfully"); } catch {}
        navigate("/blogs");
      }
    } catch (err) {
      console.error("Error publishing blog:", err);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="createblog-wrapper">
      <div className="createblog-header">
        <h1>Create a New Travel Blog</h1>
        <p>Share your journey with the world</p>
        {error && <p className="error-text">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="createblog-card">
        <h2 className="section-title">Blog Information</h2>

        <input
          type="text"
          placeholder="Blog Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="select-input"
          disabled={catLoading}
        >
          <option value="">{catLoading ? "Loading categories..." : "Select Category"}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <h2 className="section-title">Content</h2>

        {isClient && (
          <Suspense fallback={<div>Loading editor...</div>}>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              theme="snow"
              className="big-textarea"
            />
          </Suspense>
        )}

        <h2 className="section-title">SEO Settings</h2>
        <input
          type="text"
          placeholder="Meta Title"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />

        <textarea
          placeholder="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />

        <h2 className="section-title">Media Uploads</h2>

        <div className="upload-box">
          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverUpload} />
          {coverPreview && (
            <div className="cover-preview-box">
              <img src={coverPreview} alt="cover preview" className="cover-preview-img" />
              <button type="button" className="remove-cover-btn" onClick={removeCoverImage}>
                ×
              </button>
            </div>
          )}
        </div>

        <div className="upload-box">
          <label>Gallery Images</label>
          <label className="multi-upload-box" htmlFor="gallery-input">
            Click to upload multiple images
          </label>
          <input
            id="gallery-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden-input"
            onChange={handleGalleryUpload}
          />

          {galleryPreviews.length > 0 && (
            <div className="preview-grid">
              {galleryPreviews.map((src, i) => (
                <div key={i} className="preview-card">
                  <img src={src} alt="preview" className="preview-img" />
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => removeGalleryImage(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="publish-btn" disabled={loading}>
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
