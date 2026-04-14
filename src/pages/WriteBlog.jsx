import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSession } from "../utils/auth";
import { getPosts, addPost, updatePost } from "../utils/storage";

export default function WriteBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const TITLE_MAX = 100;
  const CONTENT_MAX = 2000;

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate("/login", { replace: true });
      return;
    }

    if (isEditMode) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setNotFound(true);
        return;
      }

      const canEdit =
        session.role === "admin" || session.userId === post.authorId;

      if (!canEdit) {
        setUnauthorized(true);
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    }
  }, [id, isEditMode, navigate]);

  function validate() {
    const newErrors = { title: "", content: "" };
    let valid = true;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      newErrors.title = "Title is required.";
      valid = false;
    } else if (trimmedTitle.length > TITLE_MAX) {
      newErrors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
      valid = false;
    }

    if (!trimmedContent) {
      newErrors.content = "Content is required.";
      valid = false;
    } else if (trimmedContent.length > CONTENT_MAX) {
      newErrors.content = `Content must be ${CONTENT_MAX} characters or fewer.`;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const session = getSession();
    if (!session) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        updatePost({
          id,
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        addPost({
          title: title.trim(),
          content: content.trim(),
          authorId: session.userId,
          authorName: session.displayName,
        });
      }

      navigate("/blogs", { replace: true });
    } catch (err) {
      console.error("Failed to save post:", err);
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Post Not Found</h1>
          <p className="mt-2 text-gray-600">
            The post you are trying to edit does not exist.
          </p>
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Unauthorized</h1>
          <p className="mt-2 text-gray-600">
            You do not have permission to edit this post.
          </p>
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {isEditMode ? "Edit Post" : "Create New Post"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? "Update your blog post below."
            : "Fill in the details to publish a new blog post."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              maxLength={TITLE_MAX}
              className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.title ? (
                <p className="text-xs text-red-600">{errors.title}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {title.length}/{TITLE_MAX}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              rows={12}
              maxLength={CONTENT_MAX}
              className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ${
                errors.content
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.content ? (
                <p className="text-xs text-red-600">{errors.content}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {content.length}/{CONTENT_MAX}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Post"
                : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}