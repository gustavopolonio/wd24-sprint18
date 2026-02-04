import { Navigate } from "react-router-dom";
import Loader from "../Main/components/Loader";

export function PublicRoute({ isLoggedIn, isAuthLoading, children }) {
  if (isAuthLoading) {
    return <Loader />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}