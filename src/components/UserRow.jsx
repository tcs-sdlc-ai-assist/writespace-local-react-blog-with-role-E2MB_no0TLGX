import PropTypes from "prop-types";
import { Avatar } from "./Avatar";

export function UserRow({ user, currentUserId, onDelete }) {
  const isAdmin = user.role === "admin";
  const isSelf = user.id === currentUserId;
  const deleteDisabled = isAdmin || isSelf;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <Avatar role={user.role} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user.displayName}
          </p>
          <p className="truncate text-xs text-gray-500">@{user.username}</p>
        </div>
      </div>

      <div className="hidden items-center gap-4 sm:flex">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.role === "admin"
              ? "bg-violet-100 text-violet-700"
              : "bg-indigo-100 text-indigo-700"
          }`}
        >
          {user.role === "admin" ? "Admin" : "User"}
        </span>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>

      <button
        type="button"
        disabled={deleteDisabled}
        onClick={() => {
          if (!deleteDisabled && onDelete) {
            onDelete(user.id);
          }
        }}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
          deleteDisabled
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
        }`}
        title={
          isAdmin
            ? "Cannot delete admin account"
            : isSelf
            ? "Cannot delete your own account"
            : "Delete user"
        }
      >
        Delete
      </button>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;