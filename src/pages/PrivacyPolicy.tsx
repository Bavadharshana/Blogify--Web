import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-background/95"></div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Privacy <span className="bg-gradient-primary bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <Link to="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto prose prose-slate dark:prose-invert"
          >
            <div className="bg-card rounded-lg border p-8 space-y-6">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-bold">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, write a blog post, or contact us for support.
              </p>
              <h3 className="text-xl font-semibold">Personal Information:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address</li>
                <li>Username and display name</li>
                <li>Profile information (bio, avatar)</li>
                <li>Blog content and metadata</li>
                <li>Communication preferences</li>
              </ul>

              <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Verify content quality and compliance</li>
              </ul>

              <h2 className="text-2xl font-bold">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>

              <h2 className="text-2xl font-bold">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>

              <h2 className="text-2xl font-bold">5. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.
              </p>

              <h2 className="text-2xl font-bold">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-2xl font-bold">7. Third-Party Services</h2>
              <p>
                Our service is built on Supabase, which provides our database and authentication services. We also use other third-party services for analytics and functionality. These services have their own privacy policies.
              </p>

              <h2 className="text-2xl font-bold">8. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your account and associated data</li>
                <li>Withdraw consent for data processing</li>
                <li>Export your data in a portable format</li>
              </ul>

              <h2 className="text-2xl font-bold">9. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>

              <h2 className="text-2xl font-bold">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>

              <h2 className="text-2xl font-bold">11. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold">12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="https://mail.google.com/mail/u/0/?to=dhiyaneshb.23aid@kongu.edu&fs=1&tf=cm" className="text-primary hover:underline">
                  dhiyaneshb.23aid@kongu.edu
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
