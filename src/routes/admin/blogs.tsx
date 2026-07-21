import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Search, Trash2, Edit, Plus, X, Calendar, User, BookOpen
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AdminContext, TableSkeleton } from "../admin";
import { MOCK_BLOGS, type Blog } from "@/components/maisone/Blogs";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogsPage,
});

function AdminBlogsPage() {
  const { session } = useContext(AdminContext);
  const { t } = useLanguage();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Sustainability");
  const [imageUrl, setImageUrl] = useState("");
  const [readTime, setReadTime] = useState("3 min read");

  const categories = ["Sustainability", "Supply Chain", "Technology", "Design", "Trends"];

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const query = supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2000)
      );

      const { data, error } = await (Promise.race([query, timeout]) as Promise<any>);

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.warn("Supabase blogs fetch failed in admin, loading from LocalStorage:", err);
      try {
        const local = localStorage.getItem("maisone_blogs_v4");
        if (local) {
          setBlogs(JSON.parse(local));
        } else {
          const seeded: Blog[] = MOCK_BLOGS.map((b, idx) => ({
            id: `local-blog-${idx}`,
            created_at: new Date(Date.now() - idx * 86400000).toISOString(),
            ...b
          }));
          localStorage.setItem("maisone_blogs_v4", JSON.stringify(seeded));
          setBlogs(seeded);
        }
      } catch (localErr) {
        console.error("Failed to parse local blogs in admin, resetting:", localErr);
        const seeded: Blog[] = MOCK_BLOGS.map((b, idx) => ({
          id: `local-blog-${idx}`,
          created_at: new Date(Date.now() - idx * 86400000).toISOString(),
          ...b
        }));
        localStorage.setItem("maisone_blogs_v4", JSON.stringify(seeded));
        setBlogs(seeded);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchBlogs();
    }
  }, [session]);

  const openAddModal = () => {
    setEditingBlog(null);
    setTitle("");
    setContent("");
    setAuthor("");
    setCategory("Sustainability");
    setImageUrl("");
    setReadTime("3 min read");
    setIsModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setAuthor(blog.author);
    setCategory(blog.category);
    setImageUrl(blog.image_url || "");
    setReadTime(blog.read_time);
    setIsModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category,
      image_url: imageUrl.trim() || null,
      read_time: readTime.trim() || "3 min read"
    };

    try {
      if (editingBlog) {
        // 1. Try Supabase
        const { error } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", editingBlog.id);

        if (error) throw error;
        toast.success("Blog updated in Supabase successfully!");
      } else {
        // 1. Try Supabase
        const { error } = await supabase
          .from("blogs")
          .insert([payload]);

        if (error) throw error;
        toast.success("Blog created in Supabase successfully!");
      }
      fetchBlogs();
      setIsModalOpen(false);
    } catch (err: any) {
      console.warn("Supabase save failed, performing LocalStorage operation:", err);
      // LocalStorage fallback
      const local = localStorage.getItem("maisone_blogs_v4");
      let currentBlogs: Blog[] = local ? JSON.parse(local) : [];

      if (editingBlog) {
        currentBlogs = currentBlogs.map(b =>
          b.id === editingBlog.id
            ? { ...b, ...payload, image_url: payload.image_url || undefined }
            : b
        );
        toast.success("Blog updated in LocalStorage (Offline Mode)");
      } else {
        const newBlog: Blog = {
          id: `local-blog-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...payload,
          image_url: payload.image_url || undefined
        };
        currentBlogs.unshift(newBlog);
        toast.success("Blog created in LocalStorage (Offline Mode)");
      }

      localStorage.setItem("maisone_blogs_v4", JSON.stringify(currentBlogs));
      setBlogs(currentBlogs);
      setIsModalOpen(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post permanently?")) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blogId);

      if (error) throw error;
      toast.success("Blog deleted from Supabase successfully!");
      fetchBlogs();
    } catch (err) {
      console.warn("Supabase delete failed, removing from LocalStorage:", err);
      const local = localStorage.getItem("maisone_blogs_v4");
      if (local) {
        const currentBlogs: Blog[] = JSON.parse(local);
        const updated = currentBlogs.filter(b => b.id !== blogId);
        localStorage.setItem("maisone_blogs_v4", JSON.stringify(updated));
        setBlogs(updated);
        toast.success("Blog deleted from LocalStorage (Offline Mode)");
      }
    }
  };

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.content.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  if (!session) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">{t("admin.blogsTitle")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("admin.blogsDesc")}</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-foreground text-black font-semibold text-xs py-2.5 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="size-4" /> {t("admin.addBlogPost")}
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("admin.searchBy")}
          className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-electric text-foreground"
        />
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filteredBlogs.length === 0 ? (
        <div className="glass rounded-3xl py-20 text-center border border-foreground/5">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="glass-strong rounded-3xl border border-foreground/5 bg-foreground/[0.01] p-6 flex flex-col justify-between hover:border-foreground/10 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest font-semibold bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded-full text-electric">
                    {blog.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" /> {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-foreground tracking-tight leading-snug line-clamp-1">
                  {blog.title}
                </h3>
                <p className="text-xs text-muted-foreground/80 line-clamp-3 leading-relaxed">
                  {blog.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                  <User className="size-3.5 text-electric" /> {blog.author}
                  <span>•</span>
                  <span>{blog.read_time}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 border-t border-foreground/5 pt-4">
                <button
                  onClick={() => openEditModal(blog)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors cursor-pointer"
                  title="Edit Post"
                >
                  <Edit className="size-4" />
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog.id)}
                  className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Delete Post"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 glass-strong border border-foreground/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-foreground/5 border border-foreground/5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <h2 className="font-serif text-2xl mb-6 text-foreground tracking-tight">
                {editingBlog ? t("admin.editBlogPost") : t("admin.addBlogPost")}
              </h2>

              <form onSubmit={handleSaveBlog} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Blog Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. The Art of Woven Cashmere"
                    className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Author Name</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full rounded-xl bg-[#0f0f12] border border-foreground/10 px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-electric text-foreground cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c} value={c} className="bg-[#0f0f12]">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://unsplash.com/..."
                      className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Read Time</label>
                    <input
                      type="text"
                      required
                      value={readTime}
                      onChange={e => setReadTime(e.target.value)}
                      placeholder="e.g. 3 min read"
                      className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Blog Content</label>
                  <textarea
                    required
                    rows={6}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write the blog post content here..."
                    className="w-full rounded-xl bg-foreground/[0.02] border border-foreground/10 hover:border-foreground/20 focus:border-foreground/40 focus:bg-foreground/[0.04] transition-all px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground hover:bg-foreground/90 text-black font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  {editingBlog ? "Update Blog Post" : "Publish Blog Post"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
