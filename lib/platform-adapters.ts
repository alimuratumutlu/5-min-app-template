export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export type StoredAsset = {
  key: string;
  url: string;
  contentType: string;
};

export type TemplateRepository = {
  listSessions: () => Promise<unknown[]>;
  saveSession: (payload: unknown) => Promise<{ id: string }>;
  uploadAsset: (fileName: string, bytes: Uint8Array) => Promise<StoredAsset>;
};

export const localDemoUser: AuthUser = {
  id: "demo-user",
  email: "murat@example.com",
  displayName: "Vanessa"
};

export const localTemplateRepository: TemplateRepository = {
  async listSessions() {
    return [];
  },
  async saveSession() {
    return { id: `local-${Date.now()}` };
  },
  async uploadAsset(fileName) {
    return {
      key: `local/${fileName}`,
      url: `local://${fileName}`,
      contentType: "application/octet-stream"
    };
  }
};

export const futureIntegrationNotes = {
  clerk: "Replace localDemoUser with Clerk useUser/session claims.",
  cloudflareD1: "Implement listSessions/saveSession through a Worker API backed by D1.",
  cloudflareR2: "Implement uploadAsset through a signed Worker upload URL backed by R2.",
  analytics: "Emit onboarding, session_start, session_complete, bookmark_save, and paywall_view events here."
};
