import { DocId, TableNames } from "convex/server";

export type Doc<TableName extends TableNames> = {
  _id: DocId<TableName>;
  _creationTime: number;
  [key: string]: any;
};

export type Id<TableName extends TableNames> = DocId<TableName>;

export type TableNamesInDataModel = keyof DataModel;

export type DataModel = {
  users: {};
  workspaces: {};
  projects: {};
  files: {};
  bots: {};
  integrations: {};
  deployments: {};
  chatMessages: {};
  marketplaceItems: {};
  mcpServers: {};
  activityLogs: {};
  flowNodes: {};
};
