import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../utils/auth";
import { getUsers, addUser, removeUser } from "../utils/storage";
import { UserRow } from "../components/UserRow";

export default function UserManagement() {
  const navigate = useNavigate();
  const session = getSession();

  const [users, setUsersState] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!session || session.role !== "admin") {
      navigate("/blogs", { replace: true });
      return;
    }
    setUsersState(getUsers());
  }, []);

  function refreshUsers() {
    setUsersState(getUsers());
  }

  function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword || !trimmedConfirm) {
      setError("All fields are required.");
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setError("Passwords do not match.");
      return;
    }

    if (trimmedUsername === "admin") {
      setError("Username 'admin' is reserved.");
      return;
    }

    const existingUsers = getUsers();
    const exists = existingUsers.some((u) => u.username === trimmedUsername);
    if (exists) {
      setError("Username is already taken.");
      return;
    }

    const newUser = addUser({
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: "user",
    });

    if (!newUser) {
      setError("Failed to create user. Please try again.");
      return;
    }

    setDisplayName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setSuccess(`User "${newUser.displayName}" created successfully.`);
    refreshUsers();
  }

  function handleDelete(userId) {
    const user = users.find((u) => u.id === userId);
    const name = user ? user.displayName : "this user";

    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    removeUser(userId);
    setSuccess(`User deleted successfully.`);
    setError("");
    refreshUsers();
  }

  if (!session || session.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

        <div className="rounded-2xl bg-white p-6 shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New User</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={40}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter display name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={40}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={40}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Users ({users.length})
          </h2>

          {users.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 shadow-md text-center text-gray-500">
              No registered users yet.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUserId={session.userId}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}