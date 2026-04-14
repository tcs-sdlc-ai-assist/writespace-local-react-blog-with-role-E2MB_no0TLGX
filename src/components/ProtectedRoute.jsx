import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { getSession } from "../utils/auth";

/**
 * Route guard component that checks authentication and optional role requirements.
 * - Redirects unauthenticated users to /login.
 * - Redirects users without the required role to /blogs.
 * - Renders children or Outlet if authorized.
 *
 * @param {{ requiredRole?: 'admin' | 'user', children?: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function ProtectedRoute({ requiredRole, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && session.role !== requiredRole) {
    return <Navigate to="/blogs" replace />;
  }

  return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
  requiredRole: PropTypes.string,
  children: PropTypes.node,
};

ProtectedRoute.defaultProps = {
  requiredRole: null,
  children: null,
};

export default ProtectedRoute;