import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const CreateBlog = () => {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionType, setActionType] = useState<"draft" | "verification">("draft");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent, verificationRequested = false) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.title || !formData.content) {
      setError("Title and Content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let background_image_url: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, imageFile, { upsert: false });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);
        background_image_url = publicUrlData.publicUrl;
      }

      // Ensure profile exists before creating the blog
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profileData) {
        const baseUsername = user.user_metadata?.username || user.email?.split('@')[0] || 'user';
        const randomSuffix = Math.floor(Math.random() * 10000).toString();
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: user.id,
          username: `${baseUsername}_${randomSuffix}`,
          display_name: user.user_metadata?.display_name || baseUsername,
        });
        if (profileError) {
          console.error("Failed to create missing profile:", profileError);
          throw new Error("Could not ensure user profile exists: " + profileError.message);
        }
      }

      const { data, error: insertError } = await supabase
        .from('blogs')
        .insert({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || formData.content.substring(0, 200),
          author_id: user.id,
          published: false,
          verification_requested: verificationRequested,
          background_image_url
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: verificationRequested ? "Sent for verification!" : "Draft saved!",
        description: verificationRequested 
          ? "Your post has been saved and sent for admin verification."
          : "Your blog post has been saved as a draft.",
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Post</h1>
              <p className="text-muted-foreground">Share your thoughts with the world</p>
            </div>
          </div>

          <Card className="bg-gradient-card shadow-elegant border border-border/50">
            <CardHeader>
              <CardTitle>Write Your Blog Post</CardTitle>
              <CardDescription>
                Fill in the details below to create your blog post
              </CardDescription>
            </CardHeader>

            <form onSubmit={(e) => handleSubmit(e, false)}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter your blog title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-sm font-medium">
                    Excerpt (Optional)
                  </Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Write a brief description of your blog post"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background" className="text-sm font-medium">
                    Background Image (Optional)
                  </Label>
                  <Input
                    id="background"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Background preview" className="w-full h-48 object-cover rounded-md border" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Content *
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your blog content here..."
                    value={formData.content}
                    onChange={handleInputChange}
                    className="min-h-[300px]"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      setActionType("draft");
                      handleSubmit(e, false);
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {loading && actionType === "draft" ? "Saving..." : "Save Draft"}
                  </Button>
                  
                  <Button
                    type="button"
                    disabled={loading}
                    className="bg-gradient-primary hover:shadow-elegant transition-all duration-300 flex items-center gap-2"
                    onClick={(e) => {
                      setActionType("verification");
                      handleSubmit(e, true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    {loading && actionType === "verification" ? "Applying..." : "Apply for Verification"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};