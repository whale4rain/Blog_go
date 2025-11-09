// ============================================================================
// About Page - Blog Information and Contact
// ============================================================================

import Header from '@/components/layout/Header';
import { Code, Github, Heart, Linkedin, Mail, Twitter, Zap } from 'lucide-react';

// ----------------------------------------------------------------------------
// Page Component
// ----------------------------------------------------------------------------

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-custom py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              About <span className="text-gradient">whale4blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern platform for sharing knowledge, stories, and inspiration with the world
            </p>
          </div>

          {/* Mission Statement */}
          <div className="card p-8 mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-foreground leading-relaxed mb-4">
              whale4blog is dedicated to creating a space where ideas flourish and
              knowledge is shared freely. We believe in the power of well-crafted content
              to inspire, educate, and connect people across the globe.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Built with modern web technologies and designed with Google&apos;s Material Design
              principles, we strive to provide the best reading and writing experience possible.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-google-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-google-blue" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Optimized for performance with Next.js and modern web standards
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-google-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-google-green" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Developer Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Built with TypeScript, React, and best practices in mind
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-google-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-google-red" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Made with Love</h3>
              <p className="text-sm text-muted-foreground">
                Crafted with attention to detail and user experience
              </p>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="card p-8 mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-6">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TechBadge name="Next.js 14" color="blue" />
              <TechBadge name="React 18" color="blue" />
              <TechBadge name="TypeScript" color="blue" />
              <TechBadge name="Tailwind CSS" color="green" />
              <TechBadge name="Zustand" color="green" />
              <TechBadge name="Axios" color="green" />
              <TechBadge name="Go (Backend)" color="yellow" />
              <TechBadge name="MySQL" color="yellow" />
            </div>
          </div>

          {/* Contact Section */}
          <div className="card p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Get in Touch</h2>
            <p className="text-center text-muted-foreground mb-8">
              Have questions, suggestions, or just want to say hello? We&apos;d love to hear from you!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors">
                <div className="w-12 h-12 bg-google-blue/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-google-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a
                    href="mailto:contact@inspirationblog.com"
                    className="text-sm text-google-blue hover:underline"
                  >
                    contact@inspirationblog.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors">
                <div className="w-12 h-12 bg-google-green/10 rounded-lg flex items-center justify-center">
                  <Github className="w-6 h-6 text-google-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">GitHub</h3>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-google-blue hover:underline"
                  >
                    github.com/inspirationblog
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-google-blue hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-foreground hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-google-blue hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <StatCard number="1000+" label="Articles" />
            <StatCard number="5000+" label="Users" />
            <StatCard number="10K+" label="Comments" />
            <StatCard number="50K+" label="Page Views" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------------

function TechBadge({ name, color }: { name: string; color: 'blue' | 'green' | 'yellow' }) {
  const colorClasses = {
    blue: 'bg-google-blue/10 text-google-blue',
    green: 'bg-google-green/10 text-google-green',
    yellow: 'bg-google-yellow/10 text-[hsl(45,100%,35%)]',
  };

  return (
    <div className={`px-4 py-2 rounded-lg text-center font-medium text-sm ${colorClasses[color]}`}>
      {name}
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="card p-6 text-center">
      <div className="text-3xl font-bold text-google-blue mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
