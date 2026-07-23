export declare const api: {
  auth: {
    getMe: any;
    updateProfile: any;
  };
  workspaces: {
    list: any;
    get: any;
    create: any;
    update: any;
    remove: any;
  };
  projects: {
    list: any;
    get: any;
    create: any;
    update: any;
    remove: any;
  };
  files: {
    list: any;
    get: any;
    create: any;
    update: any;
    remove: any;
  };
  bots: {
    list: any;
    create: any;
    update: any;
    remove: any;
    listFlowNodes: any;
    saveFlowNodes: any;
  };
  chat: {
    listMessages: any;
    sendMessage: any;
  };
  deployments: {
    list: any;
    create: any;
    updateStatus: any;
  };
  integrations: {
    list: any;
    create: any;
    toggle: any;
    remove: any;
    listMCPServers: any;
    createMCPServer: any;
    toggleMCPServer: any;
    removeMCPServer: any;
  };
  marketplace: {
    list: any;
    get: any;
    create: any;
  };
  activity: {
    list: any;
    listByWorkspace: any;
  };
  monetization: {
    getAdminSettings: any;
    getSetting: any;
    setSetting: any;
    getMySubscription: any;
    createSubscription: any;
    cancelSubscription: any;
    checkSubscriptionStatus: any;
    createPayment: any;
    getMyPayments: any;
    getAdSlots: any;
    getAllAdSlots: any;
    createAdSlot: any;
    updateAdSlot: any;
    deleteAdSlot: any;
    recordAdImpression: any;
    getMyCreatorCode: any;
    createCreatorCode: any;
    verifyCreatorCode: any;
    getMyReferrals: any;
    registerReferral: any;
    getMyBadges: any;
    assignBadge: any;
    removeBadge: any;
    getAllUsersWithBadges: any;
    getMyCustomLink: any;
    createCustomLink: any;
    checkCustomLinkAvailability: any;
    getAdminStats: any;
    processPaymentAction: any;
  };
  recaptcha: {
    verify: any;
  };
};

export declare const useQuery: any;
export declare const useMutation: any;
export declare const useConvex: any;
export declare const useAction: any;
