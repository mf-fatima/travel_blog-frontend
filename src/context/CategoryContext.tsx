// src/context/CategoryContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import api from "../api/axios";

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;

  fetchAllCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seeded = useRef(false);

  const DEFAULT_CATEGORIES = [
    "Beaches",
    "Bucket List",
    "Hikes",
    "Itineraries",
    "Monuments",
    "UNESCO",
    "Volcanoes",
    "Waterfalls",
    "Wildlife",
  ];

  // Helper to extract backend data
  const extract = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (res.data?.data) return res.data.data;
    if (res.data?.categories) return res.data.categories;
    return [];
  };

  // Fetch all categories
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/categories");
      let list = extract(res);

      let items = Array.isArray(list) ? list : [];

      if (!seeded.current) {
        const missing = DEFAULT_CATEGORIES.filter(
          (name) => !items.some((c: any) => String(c.name || "").toLowerCase() === name.toLowerCase())
        );
        if (missing.length > 0) {
          await Promise.all(
            missing.map((name) =>
              api.post("/categories", { name })
            )
          );
          const res2 = await api.get("/categories");
          items = extract(res2);
          seeded.current = true;
        }
      }

      setCategories(Array.isArray(items) ? items : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Load categories once on app start
  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchAllCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategory must be used inside CategoryProvider");
  return ctx;
};
