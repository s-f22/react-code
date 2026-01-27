import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // caso surja erro, corrigir com quick-fix, ou: npm install --save-dev @types/js-cookie

const RotaProtegida = ({ children }: { children: JSX.Element }) => {
  const authHash = Cookies.get("auth_hash");

  if (!authHash) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RotaProtegida;
