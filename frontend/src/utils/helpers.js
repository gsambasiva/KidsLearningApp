/**
 * SmartKids Learning App - Helper Utilities
 */

/**
 * Format seconds into MM:SS display
 */
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Get grade display name
 */
export const getGradeName = (grade) => {
  const names = {
    K: 'Kindergarten',
    1: 'Grade 1',
    2: 'Grade 2',
    3: 'Grade 3',
    4: 'Grade 4',
    5: 'Grade 5',
  };
  return names[grade] || `Grade ${grade}`;
};

/**
 * Get subject icon
 */
export const getSubjectIcon = (subject) => {
  const icons = {
    math: '🔢',
    reading: '📚',
    science: '🔬',
    art: '🎨',
    music: '🎵',
  };
  return icons[subject] || '📖';
};

/**
 * Get difficulty color
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
  };
  return colors[difficulty] || '#757575';
};

/**
 * Get grade color
 */
export const getGradeColor = (grade) => {
  const colors = {
    K: '#E91E63',
    1: '#FF5722',
    2: '#FF9800',
    3: '#8BC34A',
    4: '#00BCD4',
    5: '#9C27B0',
  };
  return colors[grade] || '#4CAF50';
};

/**
 * Calculate percentage
 */
export const calcPercent = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get performance label from score percent
 */
export const getPerformanceLabel = (percent) => {
  if (percent >= 90) return { label: 'Excellent! 🌟', color: '#4CAF50' };
  if (percent >= 75) return { label: 'Great Job! 👍', color: '#8BC34A' };
  if (percent >= 60) return { label: 'Good Work! 😊', color: '#FF9800' };
  if (percent >= 40) return { label: 'Keep Trying! 💪', color: '#FF5722' };
  return { label: 'Practice More! 📚', color: '#F44336' };
};

/**
 * Shuffle array (Fisher-Yates)
 */
export const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format large numbers with K/M suffix
 */
export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Get ordinal suffix (1st, 2nd, 3rd...)
 */
export const getOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

/**
 * Get relative time string
 */
export const getRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export default {
  formatTime,
  getGradeName,
  getSubjectIcon,
  getDifficultyColor,
  getGradeColor,
  calcPercent,
  getPerformanceLabel,
  shuffleArray,
  truncate,
  formatNumber,
  getOrdinal,
  isSameDay,
  getRelativeTime,
  generateId,
};
