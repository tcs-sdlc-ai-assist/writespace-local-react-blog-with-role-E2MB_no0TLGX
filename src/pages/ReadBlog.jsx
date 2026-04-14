import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPosts, removePost } from "../utils/storage";
import { getSession } from "../utils/auth";
import { getAvatar } from "../components/Avatar";

/**
 * Formats an ISO date string to a human-readable format.
 * @param {string} dateStr - ISO 8601 date string
 * @returns {string} Formatted date string
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const session = getSession();

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);
    if (found) {
      setPost(found);
      setNotFound(false);
    } else {
      setPost(null);
      setNotFound(true);
    }
  }, [id]);

  const canEdit =
    session &&
    post &&
    (session.role === "admin" || session.userId === post.authorId);

  const canDelete =
    session &&
    post &&
    (session.role === "admin" || session.userId === post.authorId);

  function handleDelete() {
    if (!post) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (confirmed) {
      removePost(post.id);
      navigate("/blogs");
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Post not found
          </h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  const authorRole =
    session && post.authorId === session.userId ? session.role : "user";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/blogs"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors mb-6"
        >
          ← Back to Blogs
        </Link>

        <article className="rounded-2xl bg-white p-6 sm:p-8 shadow-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            {getAvatar(authorRole)}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                {post.authorName || "Unknown"}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {(canEdit || canDelete) && (
            <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
              {canEdit && (
                <Link
                  to={`/blog/${post.id}/edit`}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
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
                  Edit
                </Link>
              )}

              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
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
                  Delete
                </button>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}