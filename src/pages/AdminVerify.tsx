import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ShieldCheck, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface BlogRow {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  created_at: string;
  verification_requested: boolean;
  verified: boolean;
  profiles: { display_name: string | null; username: string };
}

export const AdminVerify = () => {
  const { user, loading } = useAuth();
  const [pending, setPending] = useState<BlogRow[]>([]);
  const [history, setHistory] = useState<BlogRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      fetchPending();
      fetchHistory();
      const channel = supabase
        .channel('admin-verify')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => { fetchPending(); fetchHistory(); })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [loading]);

  const fetchPending = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`*, profiles ( display_name, username )`)
        .eq('verification_requested', true)
        .eq('verified', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPending((data as any) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`*, profiles ( display_name, username )`)
        .eq('verified', true)
        .order('verified_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setHistory((data as any) || []);
    } catch (err: any) {
      // don't block page on history errors
    }
  };

  const verify = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ verified: true, verified_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Verified', description: 'Blog marked as verified.' });
      await fetchPending();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-hero"><div className="animate-pulse text-xl">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Verify Blogs</h1>
              <p className="text-muted-foreground">Approve blogs submitted for verification</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fetching ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheck className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No blogs pending verification.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pending.map((b) => (
                <Card key={b.id} className="bg-gradient-card border border-border/50 cursor-pointer" onClick={() => navigate(`/blog/${b.id}`)}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{b.title}</CardTitle>
                    <CardDescription>
                      by {b.profiles.display_name || b.profiles.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{b.excerpt || b.content.substring(0, 140)}...</p>
                    <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" onClick={() => verify(b.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Verify
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">Recently Verified</h3>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No verified blogs yet.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {history.map((h) => (
                  <Card key={h.id} className="border border-border/50 cursor-pointer" onClick={() => navigate(`/blog/${h.id}`)}>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-600" /> {h.title}
                      </CardTitle>
                      <CardDescription>
                        by {h.profiles.display_name || h.profiles.username}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {h.verified_at ? new Date(h.verified_at as any).toLocaleString() : '—'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminVerify;


