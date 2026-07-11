import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, User, Clock, Loader2, AlertCircle } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/maisone/Navbar";
import { Footer } from "@/components/maisone/Footer";
import { supabase } from "@/lib/supabase";
import type { Blog } from "@/components/maisone/Blogs";

export const Route = createFileRoute("/blog/$blogId")({
  head: ({ params }) => ({
    meta: [
      { title: `Journal — Maisone` },
      { name: "description", content: "Read our latest journal updates." }
    ],
  }),
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { blogId } = Route.useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try Supabase
      const { data, error: fetchErr } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (data) {
        setBlog(data);
      } else {
        // Not found in Supabase, try LocalStorage
        loadFromLocalStorage();
      }
    } catch (err: any) {
      console.warn("Supabase fetch single blog failed, falling back to LocalStorage:", err);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const local = localStorage.getItem("maisone_blogs_v2");
      if (local) {
        const allBlogs: Blog[] = JSON.parse(local);
        const found = allBlogs.find(b => b.id === blogId);
        if (found) {
          setBlog(found);
        } else {
          setError("Article not found.");
        }
      } else {
        setError("Article not found.");
      }
    } catch (e) {
      setError("Article not found.");
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        
        <main className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-24 flex-grow w-full">
          <div className="mb-8">
            <Link 
              to="/" 
              hash="blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-electric transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="size-4" /> Back to Journal
            </Link>
          </div>

          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <Loader2 className="size-8 animate-spin text-electric" />
            </div>
          ) : error || !blog ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <AlertCircle className="size-12 text-destructive" />
              <h2 className="font-serif text-2xl text-white">Something went wrong</h2>
              <p className="text-sm text-muted-foreground">{error || "We couldn't retrieve this article. Please check the URL or try again later."}</p>
              <Link to="/" className="px-5 py-2.5 bg-foreground text-background font-semibold rounded-full text-xs hover:opacity-90 transition-opacity">
                Return to Site
              </Link>
            </div>
          ) : (
            <article className="space-y-10">
              {/* Header Info */}
              <div className="space-y-6">
                <span className="text-[10px] tracking-[0.25em] bg-electric/15 text-electric px-3 py-1.5 rounded-full uppercase font-bold border border-electric/20">
                  {blog.category}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight mt-4">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground/80 font-semibold border-b border-white/5 pb-6 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><User className="size-3.5 text-electric" /> {blog.author}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {blog.read_time}</span>
                </div>
              </div>

              {/* Cover Image */}
              {blog.image_url && (
                <div className="aspect-[21/9] w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
                  <img 
                    src={blog.image_url} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Body Content */}
              <div className="max-w-3xl mx-auto text-muted-foreground/90 whitespace-pre-line leading-relaxed text-base sm:text-lg font-normal space-y-6 pt-4">
                {blog.content}
              </div>
            </article>
          )}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
