import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSession } from "../utils/auth";
import { getPosts } from "../utils/storage";
import PublicNavbar from "../components/PublicNavbar";
import Navbar from "../components/Navbar";
import { BlogCard } from "../components/BlogCard";

export default function LandingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const session = getSession();

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setPosts(sorted);
    } catch (e) {
      console.error("Failed to load posts:", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const dashboardLink =
    session && session.role === "admin" ? "/admin" : "/blogs";

  const features = [
    {
      icon: "✍️",
      title: "Write & Publish",
      description:
        "Create beautiful blog posts with a clean, distraction-free editor. Share your thoughts with the world in seconds.",
    },
    {
      icon: "🔒",
      title: "Role-Based Access",
      description:
        "Secure your platform with built-in role management. Admins and users each get the right level of control.",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description:
        "Your blog looks great on every device. Built with a mobile-first approach using modern design principles.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {session ? <Navbar /> : <PublicNavbar />}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl leading-tight">
            Your Space to{" "}
            <span className="text-indigo-200">Write</span>,{" "}
            <span className="text-pink-200">Share</span> &{" "}
            <span className="text-purple-200">Inspire</span>
          </h1>
          <p className="mt-6 text-lg text-indigo-100 sm:text-xl max-w-2xl mx-auto">
            WriteSpace is a modern blogging platform where ideas come to life.
            Create, publish, and manage your blog posts with ease.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {session ? (
              <Link
                to={dashboardLink}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-indigo-600 shadow-md transition-colors hover:bg-indigo-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                  />
                </svg>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-indigo-600 shadow-md transition-colors hover:bg-indigo-50"
                >
                  Get Started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why WriteSpace?
            </h2>
            <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">
              Everything you need to start your blogging journey, all in one
              place.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-md transition hover:shadow-lg text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Latest Posts
              </h2>
              <p className="mt-2 text-gray-500">
                Check out what the community has been writing about.
              </p>
            </div>
            <Link
              to="/blogs"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View all posts
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 text-lg">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl mb-4">
                📝
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No posts yet
              </h3>
              <p className="text-sm text-gray-500 max-w-md mb-4">
                Be the first to share something with the community!
              </p>
              {!session && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View all posts
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                WriteSpace
              </span>
              <p className="mt-1 text-sm text-gray-400">
                Your space to write, share &amp; inspire.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link
                to="/blogs"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Blogs
              </Link>
              {!session && (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
              {session && (
                <Link
                  to="/write"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Write
                </Link>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}