import { create } from 'zustand';
import { GlitchConfig } from '@/types/glitch';

interface HistoryState {
  past: GlitchConfig[];
  present: GlitchConfig;
  future: GlitchConfig[];
  canUndo: boolean;
  canRedo: boolean;
  addToHistory: (config: GlitchConfig) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  setPresent: (config: GlitchConfig) => void;
}

const MAX_HISTORY = 50;

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  present: {} as GlitchConfig,
  future: [],
  canUndo: false,
  canRedo: false,

  addToHistory: (config: GlitchConfig) => {
    set((state) => {
      const newPast = [...state.past, state.present].slice(-MAX_HISTORY);
      return {
        past: newPast,
        present: config,
        future: [], // Clear future when new action is made
        canUndo: true,
        canRedo: false,
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
        canUndo: newPast.length > 0,
        canRedo: true,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      };
    });
  },

  clearHistory: () => {
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    });
  },

  setPresent: (config: GlitchConfig) => {
    set({ present: config });
  },
}));
