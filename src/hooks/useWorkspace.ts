import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useMemo } from "react";

export function useWorkspaces() {
  const workspaces = useQuery(api.workspaces.list);
  const createWorkspace = useMutation(api.workspaces.create);
  const updateWorkspace = useMutation(api.workspaces.update);
  const removeWorkspace = useMutation(api.workspaces.remove);

  return {
    workspaces,
    createWorkspace,
    updateWorkspace,
    removeWorkspace,
  };
}

export function useWorkspace(workspaceId: string | undefined) {
  const workspace = useQuery(
    api.workspaces.get,
    workspaceId ? { workspaceId: workspaceId as any } : "skip"
  );

  const projects = useQuery(
    api.projects.list,
    workspaceId ? { workspaceId: workspaceId as any } : "skip"
  );

  return {
    workspace,
    projects,
  };
}
