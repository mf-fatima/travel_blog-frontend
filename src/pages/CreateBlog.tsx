import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateBlog.css";

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [images, setImages] = useState<FileList | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", title);
    form.append("category", category);
    form.append("content", content);
    form.append("tags", tags);
    form.append("metaTitle", metaTitle);
    form.append("metaDescription", metaDescription);

    if (coverImage) form.append("coverImage", coverImage);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        form.append("images", images[i]);
      }
    }

    try {
      await axios.post("http://localhost:5000/api/blog/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/blogs");
    } catch (error) {
      console.log("Error creating blog:", error);
    }
  };

  return (
    <div className="createblog-container">
      <h1 className="createblog-title">Create New Blog Post</h1>

      <form onSubmit={handleSubmit} className="createblog-form">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category ID"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-height"
        />

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

        <label htmlFor="coverImage">Cover Image</label>
        <input
          id="coverImage"
          type="file"
          onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
        />

        <label htmlFor="galleryImages">Gallery Images</label>
        <input
          id="galleryImages"
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
        />

        <button type="submit" className="createblog-submit-btn">
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
