// src/context/BlogContext.tsx
import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import api from "../api/axios";

// =======================================
// 🔹 Types
// =======================================
export interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string; // holds category _id
  tags: string[];
  coverImage?: string;
  coverImageUrl?: string | null;
  images?: string[];
  imagesUrls?: (string | null)[];
  author?: { userName: string; userEmail: string };
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BlogContextType {
  blogs: Blog[];
  loading: boolean;
  error: string | null;

  createBlog: (form: FormData) => Promise<boolean>;
  fetchAllBlogs: () => Promise<void>;
  fetchBlogsByCategory: (categoryId: string) => Promise<void>;
  fetchMyBlogs: () => Promise<void>;
  deleteBlog: (id: string) => Promise<boolean>;
}

// =======================================
// 🔹 Context
// =======================================
const BlogContext = createContext<BlogContextType | null>(null);

// =======================================
// 🔹 Provider
// =======================================
export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to normalize API responses
  const extractData = (res: any) => {
    if (!res) return null;
    if (res.data?.data) return res.data.data;
    if (res.data) return res.data;
    return null;
  };

  // =======================================
  // 🟢 CREATE BLOG
  // =======================================
  const createBlog = async (form: FormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/blogs", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = extractData(res);
      const createdBlog = data?.blog || data;

      if (!createdBlog || !createdBlog._id) {
        setError("Invalid blog response from server");
        return false;
      }

      // Add new blog on top
      setBlogs((prev) => [createdBlog as Blog, ...prev]);

      return true;
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError("Unauthorized — please log in again.");
        return false;
      }

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Blog creation failed";

      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // =======================================
  // 🟢 FETCH ALL BLOGS
  // =======================================
  const fetchAllBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/blogs");
      const data = extractData(res);

      const fetched =
        Array.isArray(data) ? data : data?.blogs ?? data?.items ?? [];

      setBlogs(fetched);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load blogs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =======================================
  // 🟢 FETCH BLOGS BY CATEGORY (category _id)
  // =======================================
  const fetchBlogsByCategory = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/blogs/category/${categoryId}`);
      const data = extractData(res);

      const items =
        Array.isArray(data) ? data : data?.blogs ?? data?.items ?? [];

      setBlogs(items);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load category blogs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/blogs/my");
      const data = extractData(res);

      const items = Array.isArray(data) ? data : data?.blogs ?? [];
      setBlogs(items);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load my blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBlog = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete blog");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <BlogContext.Provider
      value={{
        blogs,
        loading,
        error,
        createBlog,
        fetchAllBlogs,
        fetchBlogsByCategory,
        fetchMyBlogs,
        deleteBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// =======================================
// 🔹 Hook
// =======================================
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog must be used inside BlogProvider");
  return context;
};
