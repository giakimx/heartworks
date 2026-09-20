"use client";

// The single demo store, shared by both sides of the marketplace.
// Persisted to localStorage with skipHydration so the server render and the
// first client render both see seed state (no hydration mismatch); a client
// effect in <StoreHydration> rehydrates after mount, gated by _hasHydrated.

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as logic from "./logic";
import { seedState } from "./seed";
import type { DemoData, Role, Skill, Viewer } from "./types";

export interface DemoState extends DemoData {
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  setGoals: (learn: Skill[], brings: Skill[]) => void;
  request: (roleId: string) => void;
  undoRequest: (roleId: string) => void;
  withdraw: (roleId: string) => void;
  accept: (appId: string) => void;
  decline: (appId: string) => void;
  undoDecision: (appId: string) => void;
  logShift: (appId: string, hours: number, skills: Skill[], note?: string) => void;
  confirmShift: (roleId: string, presentAppIds: string[]) => void;
  postRole: (role: Omit<Role, "status">, fromDraftId?: string) => void;
  saveDraft: (role: Omit<Role, "status">) => void;
  setViewer: (viewer: Viewer) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = "heartworks-demo";
// Bump on any store-shape OR seed-content change: migrate() resets stale
// localStorage blobs to the fresh seed so the demo never shows old data.
const VERSION = 4;

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...seedState(),
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setGoals: (learn, brings) =>
        set((s) => ({
          volunteers: s.volunteers.map((v) =>
            s.viewer.kind === "volunteer" && v.id === s.viewer.id
              ? { ...v, learnGoals: learn, brings }
              : v
          ),
        })),

      request: (roleId) => {
        const s = get();
        if (s.viewer.kind !== "volunteer") return;
        const changes = logic.request(s, roleId, s.viewer.id);
        if (changes) set(changes);
      },
      undoRequest: (roleId) => {
        const s = get();
        if (s.viewer.kind !== "volunteer") return;
        set(logic.undoRequest(s, roleId, s.viewer.id));
      },
      withdraw: (roleId) => {
        const s = get();
        if (s.viewer.kind !== "volunteer") return;
        set(logic.withdraw(s, roleId, s.viewer.id));
      },

      accept: (appId) => {
        const changes = logic.accept(get(), appId);
        if (changes) set(changes);
      },
      decline: (appId) => {
        const changes = logic.decline(get(), appId);
        if (changes) set(changes);
      },
      undoDecision: (appId) => {
        const changes = logic.undoDecision(get(), appId);
        if (changes) set(changes);
      },

      logShift: (appId, hours, skills, note) => {
        const changes = logic.logShift(get(), appId, hours, skills, note);
        if (changes) set(changes);
      },
      confirmShift: (roleId, presentAppIds) => {
        const changes = logic.confirmShift(get(), roleId, presentAppIds);
        if (changes) set(changes);
      },

      postRole: (role, fromDraftId) => set(logic.postRole(get(), role, fromDraftId)),
      saveDraft: (role) => set(logic.saveDraft(get(), role)),

      setViewer: (viewer) => set({ viewer }),
      resetDemo: () => set({ ...seedState() }),
    }),
    {
      name: STORAGE_KEY,
      version: VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => {
        const { _hasHydrated, ...rest } = s;
        void _hasHydrated;
        return rest;
      },
      // Any stale blob from an earlier build resets to a fresh demo.
      migrate: () => ({ ...seedState() }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);

export function useHydrated(): boolean {
  return useDemoStore((s) => s._hasHydrated);
}
