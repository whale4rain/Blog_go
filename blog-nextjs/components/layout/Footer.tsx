// ============================================================================
// Footer Component - Google-inspired Design
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-google-blue to-google-green rounded-lg flex items-center justify-center text-white font-bold text-lg">
                IB
              </div>
              <span className="text-xl font-semibold text-foreground">Inspiration Blog</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              A modern blog platform built with Next.js and Google-inspired design.
              Share your thoughts, stories, and inspiration with the world.
            </p>
            <div className="flex items-center gap-4">
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
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-google-blue hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
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
              <a
                href="mailto:contact@inspirationblog.com"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-google-red hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-google-blue transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-muted-foreground hover:text-google-blue transition-colors"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-google-blue transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-google-blue transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-google-blue transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-google-blue transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-muted-foreground hover:text-google-blue transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/api"
                  className="text-muted-foreground hover:text-google-blue transition-colors"
                >
                  API
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Inspiration Blog. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-google-blue transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-google-blue transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-google-blue transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-google-red fill-google-red" /> using Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
