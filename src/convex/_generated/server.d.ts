import { DataModel } from "./dataModel";

export interface QueryCtx {
  db: {
    get: (id: any) => Promise<any>;
    query: (tableName: string) => any;
    insert: (tableName: string, value: any) => Promise<any>;
    patch: (id: any, value: any) => Promise<void>;
    delete: (id: any) => Promise<void>;
  };
  auth: {
    getUserIdentity: () => Promise<{ tokenIdentifier: string; name?: string; email?: string; image?: string } | null>;
  };
}

export interface MutationCtx {
  db: {
    get: (id: any) => Promise<any>;
    query: (tableName: string) => any;
    insert: (tableName: string, value: any) => Promise<any>;
    patch: (id: any, value: any) => Promise<void>;
    delete: (id: any) => Promise<void>;
  };
  auth: {
    getUserIdentity: () => Promise<{ tokenIdentifier: string; name?: string; email?: string; image?: string } | null>;
  };
}

export declare function query<Args extends Record<string, any>, Output>(
  setup: {
    args: Args;
    handler: (ctx: QueryCtx, args: Args) => Promise<Output>;
  }
): any;

export declare function mutation<Args extends Record<string, any>, Output>(
  setup: {
    args: Args;
    handler: (ctx: MutationCtx, args: Args) => Promise<Output>;
  }
): any;

export declare const internalQuery: any;
export declare const internalMutation: any;
export declare const internalAction: any;
export declare const action: any;
