import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/ui/blog-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenTool, Users, BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";


interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  verified?: boolean;
  background_image_url?: string | null;
  profiles: {
    username: string;
    display_name: string;
  };
}

export const Home = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ posts: 0, users: 0, verified: 0 });

  useEffect(() => {
    fetchBlogs();
    fetchCounts();
    const blogsChannel = supabase
      .channel('blogs-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => {
        fetchBlogs();
        fetchCounts();
      })
      .subscribe();
    const usersChannel = supabase
      .channel('profiles-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchCounts();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(blogsChannel);
      supabase.removeChannel(usersChannel);
    };
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles (
            username,
            display_name
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    const [blogsRes, usersRes, verifiedRes] = await Promise.all([
      supabase.from('blogs').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('user_id', { count: 'exact', head: true }),
      supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('verified', true)
    ]);
    setCounts({
      posts: (blogsRes.count as number) || 0,
      users: (usersRes.count as number) || 0,
      verified: (verifiedRes.count as number) || 0
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Share Your{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Stories
              </span>
              <br />
              With the World
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join us and share your thoughts, experiences, and expertise on Blogify - the modern blogging platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-elegant transition-all duration-300 text-lg px-8 py-6 h-auto"
                >
                  Start Writing Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Background Video */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <video className="w-full h-full object-cover opacity-20" autoPlay muted loop playsInline preload="auto">
          <source src="https://cdn.coverr.co/videos/coverr-writing-on-a-notebook-3109/1080p.mp4" type="video/mp4" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{counts.posts}</h3>
              <p className="text-muted-foreground font-medium">Blog Posts</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{counts.users}</h3>
              <p className="text-muted-foreground font-medium">Writers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{counts.verified}</h3>
              <p className="text-muted-foreground font-medium">Verified Blogs</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-primary">Stories</span>
            </h2>
            <p className="text-xl text-foreground/90 max-w-2xl mx-auto">
              Discover the latest and most engaging blog posts from our community of writers.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">No blog posts yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share your story with the world!
              </p>
              <Link to="/register">
                <Button className="bg-gradient-primary hover:shadow-elegant transition-all duration-300">
                  Create First Post
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog, index) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  author={blog.profiles.display_name || blog.profiles.username}
                  createdAt={blog.created_at}
                  readTime={Math.ceil(blog.content.length / 200)}
                  tags={["Article"]}
                  verified={!!blog.verified}
                  backgroundImageUrl={blog.background_image_url}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-background/95"></div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join our community of passionate writers and start building your audience today.
            </p>
            <Link to="/register">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:shadow-elegant transition-all duration-300 text-lg px-8 py-6 h-auto"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Start Your Blog
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};