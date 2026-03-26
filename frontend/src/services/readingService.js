/**
 * SmartKids Reading Service
 * Manages story retrieval, progress tracking, and session data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoriesForGrade, getStoryById, getRandomStory, getGradeMeta } from '../data/readingStories';

const STORAGE_KEYS = {
  COMPLETED_STORIES: 'reading_completed_stories',
  READING_PROGRESS:  'reading_progress',
  READING_RESULTS:   'reading_results',
};

// ─── Story Retrieval ──────────────────────────────────────────────────────────

/**
 * Get all stories for a grade, enriched with completion status.
 */
export async function fetchStoriesForGrade(grade) {
  try {
    const stories = getStoriesForGrade(grade);
    const completedRaw = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
    const completed = completedRaw ? JSON.parse(completedRaw) : {};

    return stories.map((story, index) => ({
      ...story,
      isCompleted: !!(completed[story.id]),
      completedScore: completed[story.id]?.score || null,
      storyNumber: index + 1,
    }));
  } catch (e) {
    // Fallback: return raw stories without completion data
    return getStoriesForGrade(grade).map((s, i) => ({
      ...s, isCompleted: false, completedScore: null, storyNumber: i + 1,
    }));
  }
}

/**
 * Get a single story by ID and grade.
 */
export function fetchStoryById(id, grade) {
  return getStoryById(id, grade);
}

/**
 * Get a random unread story for a grade.
 */
export async function fetchNextStory(grade) {
  try {
    const stories = await fetchStoriesForGrade(grade);
    const unread = stories.filter((s) => !s.isCompleted);
    if (unread.length > 0) {
      return unread[Math.floor(Math.random() * unread.length)];
    }
    // All read — return a random one
    return getRandomStory(grade);
  } catch (e) {
    return getRandomStory(grade);
  }
}

/**
 * Get grade metadata (label, color, difficulty).
 */
export function fetchGradeMeta(grade) {
  return getGradeMeta(grade);
}

// ─── Topic → Story Mapping ────────────────────────────────────────────────────

/**
 * Filter stories by topic tag (loose match on story id prefix).
 * Returns all grade stories if topic is not specific enough.
 */
export function getStoriesForTopic(grade, topic) {
  const all = getStoriesForGrade(grade);
  const topicMap = {
    phonics:          (s) => s.grade === 'K',
    sight_words:      (s) => s.grade === 'K' || s.grade === '1',
    stories_1:        (s) => s.grade === '1',
    vocabulary_1:     (s) => s.grade === '1',
    comprehension_2:  (s) => s.grade === '2',
    vocabulary_2:     (s) => s.grade === '2',
    stories_3:        (s) => s.grade === '3',
    main_idea:        (s) => s.grade === '3',
    inference:        (s) => s.grade === '4',
    summarize:        (s) => s.grade === '4',
    analysis:         (s) => s.grade === '5',
    poetry:           (s) => s.grade === '5',
  };
  const filter = topicMap[topic];
  const filtered = filter ? all.filter(filter) : all;
  return filtered.length > 0 ? filtered : all;
}

// ─── Progress & Completion ────────────────────────────────────────────────────

/**
 * Save quiz result for a completed story.
 */
export async function saveStoryResult(storyId, grade, result) {
  try {
    // Mark story as completed
    const completedRaw = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
    const completed = completedRaw ? JSON.parse(completedRaw) : {};
    completed[storyId] = {
      score: result.scorePercent,
      completedAt: new Date().toISOString(),
      grade,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_STORIES, JSON.stringify(completed));

    // Append to results history
    const historyRaw = await AsyncStorage.getItem(STORAGE_KEYS.READING_RESULTS);
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    history.unshift({
      storyId,
      grade,
      ...result,
      savedAt: new Date().toISOString(),
    });
    // Keep last 100 results
    await AsyncStorage.setItem(
      STORAGE_KEYS.READING_RESULTS,
      JSON.stringify(history.slice(0, 100))
    );
  } catch (e) {
    // Silently fail — progress is non-critical
  }
}

/**
 * Get reading progress summary for a grade.
 */
export async function getReadingProgress(grade) {
  try {
    const stories = getStoriesForGrade(grade);
    const completedRaw = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
    const completed = completedRaw ? JSON.parse(completedRaw) : {};

    const gradeStories = stories.filter((s) => String(s.grade) === String(grade));
    const completedForGrade = gradeStories.filter((s) => completed[s.id]);
    const scores = completedForGrade.map((s) => completed[s.id]?.score || 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return {
      total: gradeStories.length,
      completed: completedForGrade.length,
      avgScore,
      percent: Math.round((completedForGrade.length / gradeStories.length) * 100),
    };
  } catch (e) {
    return { total: 25, completed: 0, avgScore: 0, percent: 0 };
  }
}

/**
 * Get all-grades reading summary.
 */
export async function getAllReadingProgress() {
  const grades = ['K', '1', '2', '3', '4', '5'];
  const results = {};
  for (const g of grades) {
    results[g] = await getReadingProgress(g);
  }
  return results;
}

/**
 * Clear all reading progress (for testing / reset).
 */
export async function resetReadingProgress() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.COMPLETED_STORIES);
    await AsyncStorage.removeItem(STORAGE_KEYS.READING_RESULTS);
  } catch (e) {
    // ignore
  }
}

export default {
  fetchStoriesForGrade,
  fetchStoryById,
  fetchNextStory,
  fetchGradeMeta,
  getStoriesForTopic,
  saveStoryResult,
  getReadingProgress,
  getAllReadingProgress,
  resetReadingProgress,
};
