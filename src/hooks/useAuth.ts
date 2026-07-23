import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useAuth() {
  const user = useQuery(api.auth.getMe);
  const updateProfile = useMutation(api.auth.updateProfile);

  return {
    user,
    isAuthenticated: !!user,
    updateProfile,
  };
}
