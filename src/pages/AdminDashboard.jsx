import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession } from "../utils/auth";
import { getPosts, removePost, getUsers } from "../utils/storage";
import { StatCard } from "../components/StatCard";
import { getAvatar } from "../components/Avatar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!session || session.role !== "admin") {
      navigate("/blogs", { replace: true });
      return;
    }
    setPosts(getPosts());
    setUsers(getUsers());
  }, []);

  if (!session || session.role !== "admin") {
    return null;
  }

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hardcoded admin
  const adminPosts = posts.filter((p) => p.authorId === "admin").length;
  const userPosts = posts.filter((p) => p.authorId !== "admin").length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  function handleDelete(postId) {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    removePost(postId);
    setPosts(getPosts());
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }

  function truncate(text, maxLength = 80) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + "...";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Welcome back, {session.displayName} 👑
          </h1>
          <p className="mt-2 text-lg text-indigo-100">
            Here&apos;s an overview of your WriteSpace platform.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Posts" count={totalPosts} icon="📝" />
          <StatCard label="Total Users" count={totalUsers} icon="👥" />
          <StatCard label="Admin Posts" count={adminPosts} icon="👑" />
          <StatCard label="User Posts" count={userPosts} icon="📖" />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/write"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Write New Post
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
            >
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
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-4a4 4 0 10-8 0 4 4 0 008 0zm6 0a4 4 0 10-8 0 4 4 0 008 0z"
                />
              </svg>
              Manage Users
            </Link>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
            >
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              View All Posts
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
          {recentPosts.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No posts yet. Start by writing your first post!
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getAvatar(
                      post.authorId === "admin" ? "admin" : "user"
                    )}
                    <div className="min-w-0">
                      <Link
                        to={`/blog/${post.id}`}
                        className="block truncate text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                      <p className="truncate text-xs text-gray-500">
                        {truncate(post.content, 80)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          by {post.authorName || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/blog/${post.id}/edit`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      aria-label={`Edit ${post.title}`}
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${post.title}`}
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}