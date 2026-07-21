import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Trash2, Edit, Plus, X, MessageSquare, User
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AdminContext, TableSkeleton } from "../admin";
import { MOCK_TESTIMONIALS, type Testimonial } from "@/components/maisone/Testimonials";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsPage,
});

function AdminTestimonialsPage() {
  const { session } = useContext(AdminContext);
  const { t } = useLanguage();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const query = supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2000)
      );

      const { data, error } = await (Promise.race([query, timeout]) as Promise<any>);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.warn("Supabase testimonials fetch failed in admin, loading from LocalStorage:", err);
      try {
        const local = localStorage.getItem("maisone_testimonials_v1");
        if (local) {
          setTestimonials(JSON.parse(local));
        } else {
          const seeded: Testimonial[] = MOCK_TESTIMONIALS.map((t, idx) => ({
            ...t,
            id: `local-testimonial-${idx}`,
            created_at: new Date(Date.now() - idx * 86400000).toISOString(),
          }));
          localStorage.setItem("maisone_testimonials_v1", JSON.stringify(seeded));
          setTestimonials(seeded);
        }
      } catch (localErr) {
        console.error("Failed to parse local testimonials in admin, resetting:", localErr);
        const seeded: Testimonial[] = MOCK_TESTIMONIALS.map((t, idx) => ({
          ...t,
          id: `local-testimonial-${idx}`,
          created_at: new Date(Date.now() - idx * 86400000).toISOString(),
        }));
        localStorage.setItem("maisone_testimonials_v1", JSON.stringify(seeded));
        setTestimonials(seeded);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchTestimonials();
    }
  }, [session]);

  const openAddModal = () => {
    setEditingTestimonial(null);
    setName("");
    setRole("");
    setQuote("");
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setName(testimonial.name);
    setRole(testimonial.role);
    setQuote(testimonial.quote);
    setIsModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      role: role.trim(),
      quote: quote.trim()
    };

    try {
      if (editingTestimonial) {
        // 1. Try Supabase
        const { error } = await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", editingTestimonial.id);

        if (error) throw error;
        toast.success("Testimonial updated in Supabase successfully!");
      } else {
        // 1. Try Supabase
        const { error } = await supabase
          .from("testimonials")
          .insert([payload]);

        if (error) throw error;
        toast.success("Testimonial created in Supabase successfully!");
      }
      fetchTestimonials();
      setIsModalOpen(false);
    } catch (err: any) {
      console.warn("Supabase save failed, performing LocalStorage operation:", err);
      // LocalStorage fallback
      const local = localStorage.getItem("maisone_testimonials_v1");
      let currentTestimonials: Testimonial[] = local ? JSON.parse(local) : [];

      if (editingTestimonial) {
        currentTestimonials = currentTestimonials.map(t =>
          t.id === editingTestimonial.id
            ? { ...t, ...payload }
            : t
        );
        toast.success("Testimonial updated in LocalStorage (Offline Mode)");
      } else {
        const newTestimonial: Testimonial = {
          id: `local-testimonial-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...payload
        };
        currentTestimonials.unshift(newTestimonial);
        toast.success("Testimonial created in LocalStorage (Offline Mode)");
      }

      localStorage.setItem("maisone_testimonials_v1", JSON.stringify(currentTestimonials));
      setTestimonials(currentTestimonials);
      setIsModalOpen(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!confirm("Are you sure you want to delete this testimonial permanently?")) return;

    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", testimonialId);

      if (error) throw error;
      toast.success("Testimonial deleted from Supabase successfully!");
      fetchTestimonials();
    } catch (err) {
      console.warn("Supabase delete failed, removing from LocalStorage:", err);
      const local = localStorage.getItem("maisone_testimonials_v1");
      if (local) {
        const currentTestimonials: Testimonial[] = JSON.parse(local);
        const updated = currentTestimonials.filter(t => t.id !== testimonialId);
        localStorage.setItem("maisone_testimonials_v1", JSON.stringify(updated));
        setTestimonials(updated);
        toast.success("Testimonial deleted from LocalStorage (Offline Mode)");
      }
    }
  };

  const filteredTestimonials = testimonials.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.quote.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase())
  );

  if (!session) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">{t("admin.testimonialsTitle")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("admin.testimonialsDesc")}</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-white text-black font-semibold text-xs py-2.5 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="size-4" /> {t("admin.addTestimonial")}
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("admin.searchBy")}
          className="w-full rounded-xl bg-black/30 border border-white/10 pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-electric text-white"
        />
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filteredTestimonials.length === 0 ? (
        <div className="glass rounded-3xl py-20 text-center border border-white/5">
          <p className="text-muted-foreground">No testimonials found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass-strong rounded-3xl border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between hover:border-white/10 transition-colors min-h-[280px]"
            >
              <div className="space-y-4">
                <blockquote className="font-serif text-xl leading-snug text-balance">
                  "{testimonial.quote}"
                </blockquote>
                <figcaption className="mt-8 border-l-2 border-electric/50 pl-4">
                  <p className="text-sm font-medium text-white">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{testimonial.role}</p>
                </figcaption>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 border-t border-white/5 pt-4">
                <button
                  onClick={() => openEditModal(testimonial)}
                  className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  title="Edit Testimonial"
                >
                  <Edit className="size-4" />
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                  className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Delete Testimonial"
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
              className="relative z-10 glass-strong border border-white/10 rounded-3xl max-w-xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>

              <h2 className="font-serif text-2xl mb-6 text-white tracking-tight">
                {editingTestimonial ? t("admin.editTestimonial") : t("admin.addTestimonial")}
              </h2>

              <form onSubmit={handleSaveTestimonial} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Aiko Tanaka"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Role & Company</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Head of Production · Maison Kyō"
                      className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Testimonial Quote</label>
                  <textarea
                    required
                    rows={4}
                    value={quote}
                    onChange={e => setQuote(e.target.value)}
                    placeholder="Write the customer's quote here..."
                    className="w-full rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.04] transition-all px-4 py-3 text-xs text-white placeholder:text-muted-foreground/30 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  {editingTestimonial ? "Update Testimonial" : "Publish Testimonial"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
