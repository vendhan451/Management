// Utility functions for localStorage CRUD
export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getData(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

export function removeData(key) {
  localStorage.removeItem(key);
}

// Training session structure
export const TRAINING_CATEGORIES = ['onboarding', 'compliance', 'technical', 'soft-skills', 'leadership'];
export const TRAINING_TYPES = ['in-person', 'virtual', 'hybrid'];
export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'];
export const SESSION_STATUS = ['scheduled', 'completed', 'cancelled'];

export function createTrainingSession({
  title,
  category,
  type,
  startDate,
  endDate,
  instructor,
  materials = [],
  prerequisites = [],
  skillLevel,
  status = 'scheduled',
}) {
  return {
    id: Date.now(),
    title,
    category,
    type,
    startDate,
    endDate,
    instructor,
    materials, // [{ title, url }]
    prerequisites, // [sessionId]
    skillLevel,
    status,
  };
}
