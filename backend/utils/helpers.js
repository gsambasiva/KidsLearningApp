/**
 * SmartKids Backend - Helper Utilities
 */

exports.shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

exports.calculateLevel = (stars) => {
  if (stars < 50) return 1;
  if (stars < 150) return 2;
  if (stars < 350) return 3;
  if (stars < 700) return 4;
  if (stars < 1200) return 5;
  return Math.floor(stars / 300) + 1;
};
