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

  const {
    categories,
    loading: catLoading,
    fetchAllCategories,
  } = useCategory();

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

  // ======================================================
  // ENABLE REACT QUILL ONLY ON CLIENT
  // ======================================================

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ======================================================
  // FETCH CATEGORIES
  // ======================================================

  useEffect(() => {
    if (categories.length === 0) {
      fetchAllCategories();
    }
  }, [categories.length, fetchAllCategories]);

  // ======================================================
  // CLEANUP PREVIEWS
  // ======================================================

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }

      galleryPreviews.forEach((src) => {
        URL.revokeObjectURL(src);
      });
    };
  }, [coverPreview, galleryPreviews]);

  // ======================================================
  // COVER IMAGE UPLOAD
  // ======================================================

  const handleCoverUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(file);

    // remove old preview
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverPreview(URL.createObjectURL(file));
  };

  // ======================================================
  // REMOVE COVER IMAGE
  // ======================================================

  const removeCoverImage = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverImage(null);
    setCoverPreview(null);
  };

  // ======================================================
  // GALLERY IMAGE UPLOAD
  // ======================================================

  const handleGalleryUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files) return;

    const newFiles = Array.from(files);

    setGalleryImages((prev) => [...prev, ...newFiles]);

    const previews = newFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  // ======================================================
  // REMOVE GALLERY IMAGE
  // ======================================================

  const removeGalleryImage = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);

    setGalleryImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setGalleryPreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ======================================================
  // SUBMIT BLOG
  // ======================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      alert("Please enter blog title");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    if (!content.trim()) {
      alert("Please write blog content");
      return;
    }

    try {
      const formData = new FormData();

      // Basic fields
      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);

      // Tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      formData.append("tags", JSON.stringify(tagArray));

      // SEO
      if (metaTitle.trim()) {
        formData.append("metaTitle", metaTitle);
      }

      if (metaDescription.trim()) {
        formData.append(
          "metaDescription",
          metaDescription
        );
      }

      // Cover Image
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      // Gallery Images
      galleryImages.forEach((image) => {
        formData.append("images", image);
      });

      // Create blog
      const success = await createBlog(formData);

      if (success) {
        try {
          localStorage.setItem(
            "toast",
            "Blog created successfully"
          );
        } catch {}

        navigate("/blogs");
      }
    } catch (err) {
      console.error("Error publishing blog:", err);
    }
  };

  // ======================================================
  // REACT QUILL MODULES
  // ======================================================

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
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
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="createblog-header">
        <h1>Create a New Travel Blog</h1>

        <p>Share your journey with the world</p>

        {error && (
          <p className="error-text">{error}</p>
        )}
      </div>

      {/* ================================================== */}
      {/* FORM */}
      {/* ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="createblog-card"
      >
        {/* BLOG INFO */}

        <h2 className="section-title">
          Blog Information
        </h2>

        <input
          type="text"
          placeholder="Blog Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="select-input"
          disabled={catLoading}
        >
          <option value="">
            {catLoading
              ? "Loading categories..."
              : "Select Category"}
          </option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* TAGS */}

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* CONTENT */}

        <h2 className="section-title">Content</h2>

        {isClient && (
          <Suspense
            fallback={<div>Loading editor...</div>}
          >
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

        {/* SEO */}

        <h2 className="section-title">
          SEO Settings
        </h2>

        <input
          type="text"
          placeholder="Meta Title"
          value={metaTitle}
          onChange={(e) =>
            setMetaTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Meta Description"
          value={metaDescription}
          onChange={(e) =>
            setMetaDescription(e.target.value)
          }
        />

        {/* MEDIA */}

        <h2 className="section-title">
          Media Uploads
        </h2>

        {/* COVER IMAGE */}

        <div className="upload-box">
          <label>Cover Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
          />

          {coverPreview && (
            <div className="cover-preview-box">
              <img
                src={coverPreview}
                alt="cover preview"
                className="cover-preview-img"
              />

              <button
                type="button"
                className="remove-cover-btn"
                onClick={removeCoverImage}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* GALLERY IMAGES */}

        <div className="upload-box">
          <label>Gallery Images</label>

          <label
            className="multi-upload-box"
            htmlFor="gallery-input"
          >
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
                <div
                  key={i}
                  className="preview-card"
                >
                  <img
                    src={src}
                    alt="preview"
                    className="preview-img"
                  />

                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() =>
                      removeGalleryImage(i)
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          className="publish-btn"
          disabled={loading}
        >
          {loading
            ? "Publishing..."
            : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;