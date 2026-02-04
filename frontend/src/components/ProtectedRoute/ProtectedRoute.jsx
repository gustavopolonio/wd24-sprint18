import { Navigate, useLocation } from "react-router-dom"
import Loader from "../Main/components/Loader";

export function ProtectedRoute({ isAuthLoading, isLoggedIn, children }) {
  const location = useLocation()

  if (isAuthLoading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from:location }} replace />
  }

  return children
}