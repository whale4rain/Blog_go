// ============================================================================
// Dashboard Home Page - Admin Overview
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  Heart,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  Settings,
  PlusCircle,
} from "lucide-react";

// ----------------------------------------------------------------------------
// Page Component
// ----------------------------------------------------------------------------

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin } = useUserStore();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchStats();
  }, [isLoggedIn]);

  const fetchStats = async () => {
    try {
      // Mock data for now - integrate with API later
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStats({
        totalArticles: 42,
        totalViews: 15234,
        totalLikes: 892,
        totalComments: 156,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back,{" "}
                <span className="font-medium text-foreground">
                  {user?.username}
                </span>
                !
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 border-2 border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Articles"
            value={stats.totalArticles}
            icon={<FileText className="w-8 h-8" />}
            color="blue"
            loading={loading}
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            icon={<Eye className="w-8 h-8" />}
            color="green"
            loading={loading}
          />
          <StatCard
            title="Total Likes"
            value={stats.totalLikes}
            icon={<Heart className="w-8 h-8" />}
            color="red"
            loading={loading}
          />
          <StatCard
            title="Total Comments"
            value={stats.totalComments}
            icon={<MessageSquare className="w-8 h-8" />}
            color="yellow"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              href="/dashboard/articles/create"
              icon={<PlusCircle className="w-6 h-6" />}
              title="New Article"
              description="Create a new blog post"
              color="blue"
            />
            <ActionButton
              href="/dashboard/images"
              icon={<ImageIcon className="w-6 h-6" />}
              title="Upload Image"
              description="Manage your media"
              color="green"
            />
            <ActionButton
              href="/dashboard/settings"
              icon={<Settings className="w-6 h-6" />}
              title="Settings"
              description="Configure your account"
              color="gray"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Recent Articles
              </h2>
              <Link
                href="/dashboard/articles"
                className="text-sm text-google-blue hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-20" />
                ))
              ) : (
                <>
                  <ArticleItem
                    title="Getting Started with Next.js"
                    date="2 hours ago"
                    views={234}
                    likes={12}
                  />
                  <ArticleItem
                    title="React Best Practices"
                    date="1 day ago"
                    views={567}
                    likes={45}
                  />
                  <ArticleItem
                    title="TypeScript Tips and Tricks"
                    date="3 days ago"
                    views={892}
                    likes={67}
                  />
                </>
              )}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Recent Comments
              </h2>
              <Link
                href="/dashboard/comments"
                className="text-sm text-google-blue hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-20" />
                ))
              ) : (
                <>
                  <CommentItem
                    author="John Doe"
                    content="Great article! Very helpful information."
                    date="1 hour ago"
                  />
                  <CommentItem
                    author="Jane Smith"
                    content="Thanks for sharing these tips!"
                    date="3 hours ago"
                  />
                  <CommentItem
                    author="Mike Johnson"
                    content="Looking forward to more content like this."
                    date="5 hours ago"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* System Info */}
        {isAdmin && (
          <div className="card p-6 mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              System Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoItem label="Total Users" value="156" />
              <InfoItem label="Database Size" value="2.3 GB" />
              <InfoItem label="Server Status" value="Online" badge="success" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------------

function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "yellow";
  loading: boolean;
}) {
  const colorClasses = {
    blue: "bg-google-blue/10 text-google-blue",
    green: "bg-google-green/10 text-google-green",
    red: "bg-google-red/10 text-google-red",
    yellow: "bg-google-yellow/10 text-[hsl(45,100%,35%)]",
  };

  return (
    <div className="card p-6">
      {loading ? (
        <>
          <div className="skeleton h-12 w-12 rounded-lg mb-4" />
          <div className="skeleton h-8 w-24 mb-2" />
          <div className="skeleton h-4 w-32" />
        </>
      ) : (
        <>
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color]}`}
          >
            {icon}
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {value.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </>
      )}
    </div>
  );
}

function ActionButton({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "gray";
}) {
  const colorClasses = {
    blue: "bg-google-blue text-white hover:bg-[hsl(214,90%,48%)]",
    green: "bg-google-green text-white hover:bg-[hsl(142,71%,41%)]",
    gray: "bg-muted text-foreground hover:bg-muted/80",
  };

  return (
    <Link
      href={href}
      className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${colorClasses[color]}`}
    >
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Link>
  );
}

function ArticleItem({
  title,
  date,
  views,
  likes,
}: {
  title: string;
  date: string;
  views: number;
  likes: number;
}) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg hover:bg-muted transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {views}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {likes}
        </span>
      </div>
    </div>
  );
}

function CommentItem({
  author,
  content,
  date,
}: {
  author: string;
  content: string;
  date: string;
}) {
  return (
    <div className="p-4 rounded-lg hover:bg-muted transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-google-blue text-white flex items-center justify-center text-sm font-medium">
          {author.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">{author}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      <p className="text-sm text-foreground">{content}</p>
    </div>
  );
}

function InfoItem({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: "success" | "warning" | "error";
}) {
  const badgeClasses = {
    success: "bg-google-green/10 text-google-green",
    warning: "bg-google-yellow/10 text-[hsl(45,100%,35%)]",
    error: "bg-google-red/10 text-google-red",
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {badge && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClasses[badge]}`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
