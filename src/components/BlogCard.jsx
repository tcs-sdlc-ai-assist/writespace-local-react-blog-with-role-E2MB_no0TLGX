import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getAvatar } from "./Avatar";
import { getSession } from "../utils/auth";

/**
 * Truncates a string to the specified max length, appending "..." if truncated.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
function truncate(text, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

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
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * BlogCard component — displays a blog post preview in a card layout.
 * Shows title, content excerpt, date, author with avatar, and an edit link
 * if the current user is the author or an admin.
 *
 * @param {{ post: Object }} props
 * @returns {JSX.Element}
 */
export function BlogCard({ post }) {
  const session = getSession();

  const canEdit =
    session &&
    (session.role === "admin" || session.userId === post.authorId);

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
      <div>
        <Link to={`/blog/${post.id}`}>
          <h2 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {truncate(post.content, 120)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getAvatar(
            session && post.authorId === session.userId
              ? session.role
              : "user"
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {post.authorName || "Unknown"}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/blog/${post.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Read
          </Link>

          {canEdit && (
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
          )}
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string,
  }).isRequired,
};

export default BlogCard;