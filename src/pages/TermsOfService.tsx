import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const TermsOfService = () => {
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
              Terms of <span className="bg-gradient-primary bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Please read these terms carefully before using our service.
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

              <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Blogify ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials on Blogify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h2 className="text-2xl font-bold">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-bold">4. Content Policy</h2>
              <p>
                You are responsible for the content you post on Blogify. You agree not to post content that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Is illegal, harmful, threatening, abusive, or defamatory</li>
                <li>Violates any intellectual property rights</li>
                <li>Contains spam or unsolicited commercial content</li>
                <li>Contains malicious code or viruses</li>
                <li>Is intended to harass or intimidate other users</li>
              </ul>

              <h2 className="text-2xl font-bold">5. Content Verification</h2>
              <p>
                All blog posts are subject to verification by our admin team before being published to the public. We reserve the right to reject, edit, or remove content that does not meet our quality standards or violates our content policy.
              </p>

              <h2 className="text-2xl font-bold">6. Privacy Policy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>

              <h2 className="text-2xl font-bold">7. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2 className="text-2xl font-bold">8. Disclaimer</h2>
              <p>
                The materials on Blogify are provided on an 'as is' basis. Blogify makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-bold">9. Limitations</h2>
              <p>
                In no event shall Blogify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Blogify, even if Blogify or a Blogify authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h2 className="text-2xl font-bold">10. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>

              <h2 className="text-2xl font-bold">11. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2 className="text-2xl font-bold">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at{" "}
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
