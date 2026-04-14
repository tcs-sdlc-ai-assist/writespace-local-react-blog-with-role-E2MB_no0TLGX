import React from "react";

/**
 * Returns a styled avatar JSX element based on the user's role.
 * @param {'admin' | 'user'} role - The role of the user.
 * @returns {JSX.Element} A styled avatar element.
 */
export function getAvatar(role) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-violet-500 text-white text-lg shadow-md">
        👑
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500 text-white text-lg shadow-md">
      📖
    </span>
  );
}

/**
 * Avatar React component that renders a role-based avatar.
 * @param {{ role: 'admin' | 'user' }} props
 * @returns {JSX.Element}
 */
export function Avatar({ role }) {
  return getAvatar(role);
}

export default Avatar;