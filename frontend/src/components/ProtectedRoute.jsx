import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20vh" }}
      >
        <h2>Loading your session...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />; // later we can use state location as well
  }

  return <Outlet />;
}

export default ProtectedRoute;
