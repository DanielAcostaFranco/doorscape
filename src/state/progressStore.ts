export interface ProgressState {
  schemaVersion: 1;
  completedDoorIds: string[];
}

const defaultProgress: ProgressState = {
  schemaVersion: 1,
  completedDoorIds: [],
};

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return defaultProgress;

  try {
    const saved = window.localStorage.getItem('doorscape-progress');
    if (!saved) return defaultProgress;
    const parsed = JSON.parse(saved) as Partial<ProgressState>;
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.completedDoorIds)) {
      return defaultProgress;
    }
    return { schemaVersion: 1, completedDoorIds: parsed.completedDoorIds.filter((id): id is string => typeof id === 'string') };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: ProgressState) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('doorscape-progress', JSON.stringify(progress));
  }
}
