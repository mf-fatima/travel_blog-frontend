// src/context/BlogContext.tsx

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";

import api from "../api/axios";

// =======================================
// 🔹 API BASE URL
// =======================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =======================================
// 🔹 Types
// =======================================

export interface Blog {
  _id: string;
  title: string;
  content: string;

  // Category ID
  category: string;

  tags: string[];

  // Images
  coverImage?: string;
  images?: string[];

  // Author
  author?: {
    userName: string;
    userEmail: string;
  };

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface BlogContextType {
  blogs: Blog[];

  loading: boolean;

  error: string | null;

  createBlog: (
    form: FormData
  ) => Promise<boolean>;

  fetchAllBlogs: () => Promise<void>;

  fetchBlogsByCategory: (
    categoryId: string
  ) => Promise<void>;

  fetchMyBlogs: () => Promise<void>;

  deleteBlog: (
    id: string
  ) => Promise<boolean>;
}

// =======================================
// 🔹 Context
// =======================================

const BlogContext =
  createContext<BlogContextType | null>(
    null
  );

// =======================================
// 🔹 Helper Functions
// =======================================

// Normalize blog image URLs
const normalizeBlog = (
  blog: Blog
): Blog => {
  return {
    ...blog,

    // Cover image
    coverImage: blog.coverImage
      ? `${API_BASE_URL}${blog.coverImage}`
      : undefined,

    // Gallery images
    images: blog.images?.map((img) =>
      img.startsWith("http")
        ? img
        : `${API_BASE_URL}${img}`
    ),
  };
};

// Normalize multiple blogs
const normalizeBlogs = (
  blogs: Blog[]
): Blog[] => {
  return blogs.map(normalizeBlog);
};

// =======================================
// 🔹 Provider
// =======================================

export const BlogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [blogs, setBlogs] = useState<
    Blog[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // =======================================
  // 🔹 Extract API Data
  // =======================================

  const extractData = (res: any) => {
    if (!res) return null;

    if (res.data?.data) {
      return res.data.data;
    }

    if (res.data) {
      return res.data;
    }

    return null;
  };

  // =======================================
  // 🟢 CREATE BLOG
  // =======================================

  const createBlog = async (
    form: FormData
  ): Promise<boolean> => {
    try {
      setLoading(true);

      setError(null);

      const res = await api.post(
        "/blogs",
        form,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          withCredentials: true,
        }
      );

      const data =
        extractData(res);

      const createdBlog =
        data?.blog || data;

      if (
        !createdBlog ||
        !createdBlog._id
      ) {
        setError(
          "Invalid blog response from server"
        );

        return false;
      }

      // Normalize image URLs
      const normalizedBlog =
        normalizeBlog(
          createdBlog as Blog
        );

      // Add new blog at top
      setBlogs((prev) => [
        normalizedBlog,
        ...prev,
      ]);

      return true;
    } catch (err: any) {
      console.error(
        "Create Blog Error:",
        err
      );

      // Unauthorized
      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403
      ) {
        setError(
          "Unauthorized — please log in again."
        );

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

  const fetchAllBlogs =
    useCallback(async () => {
      try {
        setLoading(true);

        setError(null);

        const res =
          await api.get("/blogs");

        const data =
          extractData(res);

        const fetched =
          Array.isArray(data)
            ? data
            : data?.blogs ??
              data?.items ??
              [];

        // Normalize image URLs
        const normalizedData =
          normalizeBlogs(
            fetched
          );

        setBlogs(
          normalizedData
        );
      } catch (err: any) {
        setError(
          err?.response?.data
            ?.message ||
            "Failed to load blogs"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // =======================================
  // 🟢 FETCH BLOGS BY CATEGORY
  // =======================================

  const fetchBlogsByCategory =
    useCallback(
      async (
        categoryId: string
      ) => {
        try {
          setLoading(true);

          setError(null);

          const res =
            await api.get(
              `/blogs/category/${categoryId}`
            );

          const data =
            extractData(
              res
            );

          const items =
            Array.isArray(
              data
            )
              ? data
              : data?.blogs ??
                data?.items ??
                [];

          // Normalize image URLs
          const normalizedData =
            normalizeBlogs(
              items
            );

          setBlogs(
            normalizedData
          );
        } catch (err: any) {
          setError(
            err?.response?.data
              ?.message ||
              "Failed to load category blogs"
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  // =======================================
  // 🟢 FETCH MY BLOGS
  // =======================================

  const fetchMyBlogs =
    useCallback(async () => {
      try {
        setLoading(true);

        setError(null);

        const res =
          await api.get(
            "/blogs/my"
          );

        const data =
          extractData(
            res
          );

        const items =
          Array.isArray(
            data
          )
            ? data
            : data?.blogs ??
              [];

        // Normalize image URLs
        const normalizedData =
          normalizeBlogs(
            items
          );

        setBlogs(
          normalizedData
        );
      } catch (err: any) {
        setError(
          err?.response?.data
            ?.message ||
            "Failed to load my blogs"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // =======================================
  // 🟢 DELETE BLOG
  // =======================================

  const deleteBlog =
    useCallback(
      async (
        id: string
      ) => {
        try {
          setLoading(true);

          setError(null);

          await api.delete(
            `/blogs/${id}`
          );

          setBlogs((prev) =>
            prev.filter(
              (blog) =>
                blog._id !== id
            )
          );

          return true;
        } catch (err: any) {
          setError(
            err?.response?.data
              ?.message ||
              "Failed to delete blog"
          );

          return false;
        } finally {
          setLoading(false);
        }
      },
      []
    );

  // =======================================
  // 🔹 Provider
  // =======================================

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
  const context =
    useContext(
      BlogContext
    );

  if (!context) {
    throw new Error(
      "useBlog must be used inside BlogProvider"
    );
  }

  return context;
};