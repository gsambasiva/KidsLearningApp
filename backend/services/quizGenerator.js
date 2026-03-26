/**
 * SmartKids Learning App - Dynamic Quiz Generator
 * Generates questions dynamically based on grade, topic, difficulty
 */

const { shuffleArray } = require('../utils/helpers');



/**
 * Main quiz generation function
 */
exports.generate = async ({ grade, subject, topic, difficulty, count = 10 }) => {
  let questions = [];

  if (subject === 'math') {
    questions = generateMathQuestions({ grade, topic, difficulty, count });
  } else if (subject === 'reading') {
    questions = generateReadingQuestions({ grade, topic, difficulty, count });
  }

  // Shuffle and return requested count
  return shuffleArray(questions).slice(0, count);
};

// ==============================
// MATH QUESTION GENERATORS
// ==============================

const generateMathQuestions = ({ grade, topic, difficulty, count }) => {
  const generators = {
    counting: generateCountingQuestions,
    addition: generateAdditionQuestions,
    subtraction: generateSubtractionQuestions,
    multiplication: generateMultiplicationQuestions,
    division: generateDivisionQuestions,
    fractions: generateFractionQuestions,
    word_problems: generateWordProblemQuestions,
    word_problems_adv: generateAdvancedWordProblemQuestions,
    place_value: generatePlaceValueQuestions,
    mixed: generateMixedMathQuestions,
  };

  const generator = generators[topic] || generators.addition;
  return generator({ difficulty, count: count * 2, grade }); // Generate 2x to have variety
};

// Counting Questions (Kindergarten)
const generateCountingQuestions = ({ difficulty, count }) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 100;
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const type = Math.random() > 0.5 ? 'what_comes_after' : 'count_objects';

    if (type === 'what_comes_after') {
      const correct = num1 + 1;
      questions.push({
        id: `count_${i}_${Date.now()}`,
        type: 'multiple_choice',
        question: `What number comes after ${num1}?`,
        options: shuffleArray([
          String(correct),
          String(correct - 1),
          String(correct + 1),
          String(correct + 2),
        ]).slice(0, 4),
        correctAnswer: String(correct),
        explanation: `Counting forward: ...${num1}, ${correct}. ${correct} comes after ${num1}!`,
        difficulty,
      });
    } else {
      const emojis = ['⭐', '🍎', '🎈', '🦆', '🌸'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const displayCount = Math.min(num1, 10);
      questions.push({
        id: `count_obj_${i}_${Date.now()}`,
        type: 'multiple_choice',
        question: `How many ${emoji} are there?\n${emoji.repeat(displayCount)}`,
        options: shuffleArray([
          String(displayCount),
          String(displayCount - 1 > 0 ? displayCount - 1 : displayCount + 2),
          String(displayCount + 1),
          String(displayCount + 2),
        ]).slice(0, 4),
        correctAnswer: String(displayCount),
        explanation: `Count them: ${Array.from({length: displayCount}, (_, i) => i + 1).join(', ')}. There are ${displayCount}!`,
        difficulty,
      });
    }
  }
  return questions;
};

// Addition Questions
const generateAdditionQuestions = ({ difficulty, count, grade }) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    let max1, max2;
    if (difficulty === 'easy') {
      max1 = grade <= 1 ? 10 : 20;
      max2 = grade <= 1 ? 10 : 20;
    } else if (difficulty === 'medium') {
      max1 = grade <= 2 ? 50 : 100;
      max2 = grade <= 2 ? 50 : 100;
    } else {
      max1 = 500;
      max2 = 500;
    }

    const a = Math.floor(Math.random() * max1) + 1;
    const b = Math.floor(Math.random() * max2) + 1;
    const correct = a + b;

    const qType = Math.random() > 0.3 ? 'multiple_choice' : 'fill_blank';

    if (qType === 'fill_blank' && difficulty !== 'easy') {
      const missing = Math.random() > 0.5 ? 'a' : 'b';
      const questionText = missing === 'a'
        ? `___ + ${b} = ${correct}`
        : `${a} + ___ = ${correct}`;
      questions.push({
        id: `add_fb_${i}_${Date.now()}`,
        type: 'fill_blank',
        question: questionText,
        correctAnswer: String(missing === 'a' ? a : b),
        hint: `What number plus ${missing === 'a' ? b : a} equals ${correct}?`,
        explanation: `${a} + ${b} = ${correct}`,
        difficulty,
      });
    } else {
      const wrongs = generateWrongAnswers(correct, 3, max1 + max2);
      questions.push({
        id: `add_${i}_${Date.now()}`,
        type: 'multiple_choice',
        question: `What is ${a} + ${b}?`,
        options: shuffleArray([String(correct), ...wrongs.map(String)]),
        correctAnswer: String(correct),
        explanation: `${a} + ${b} = ${correct}. ${getAdditionExplanation(a, b, correct)}`,
        difficulty,
      });
    }
  }
  return questions;
};

// Subtraction Questions
const generateSubtractionQuestions = ({ difficulty, count, grade }) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const max = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 100 : 1000;
    const b = Math.floor(Math.random() * (max / 2)) + 1;
    const correct = Math.floor(Math.random() * (max / 2)) + 1;
    const a = b + correct; // Ensure positive result

    const wrongs = generateWrongAnswers(correct, 3, max);
    questions.push({
      id: `sub_${i}_${Date.now()}`,
      type: 'multiple_choice',
      question: `What is ${a} - ${b}?`,
      options: shuffleArray([String(correct), ...wrongs.map(String)]),
      correctAnswer: String(correct),
      explanation: `${a} - ${b} = ${correct}. Start at ${a} and count back ${b}!`,
      difficulty,
    });
  }
  return questions;
};

// Multiplication Questions
const generateMultiplicationQuestions = ({ difficulty, count }) => {
  const questions = [];
  const tables = difficulty === 'easy' ? [2, 3, 4, 5] : difficulty === 'medium' ? [6, 7, 8, 9] : [11, 12, 13, 14];

  for (let i = 0; i < count; i++) {
    const a = tables[Math.floor(Math.random() * tables.length)];
    const b = Math.floor(Math.random() * 10) + 1;
    const correct = a * b;
    const wrongs = generateWrongAnswers(correct, 3, 200);

    const qType = Math.random() > 0.4 ? 'multiple_choice' : 'fill_blank';
    if (qType === 'fill_blank') {
      questions.push({
        id: `mul_fb_${i}_${Date.now()}`,
        type: 'fill_blank',
        question: `${a} × ___ = ${correct}`,
        correctAnswer: String(b),
        hint: `What times ${a} equals ${correct}?`,
        explanation: `${a} × ${b} = ${correct}`,
        difficulty,
      });
    } else {
      questions.push({
        id: `mul_${i}_${Date.now()}`,
        type: 'multiple_choice',
        question: `What is ${a} × ${b}?`,
        options: shuffleArray([String(correct), ...wrongs.map(String)]),
        correctAnswer: String(correct),
        explanation: `${a} × ${b} = ${correct}. That's ${a} groups of ${b}!`,
        difficulty,
      });
    }
  }
  return questions;
};

// Division Questions
const generateDivisionQuestions = ({ difficulty, count }) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const divisor = Math.floor(Math.random() * 8) + 2;
    const quotient = Math.floor(Math.random() * 10) + 1;
    const dividend = divisor * quotient;
    const correct = quotient;
    const wrongs = generateWrongAnswers(correct, 3, 50);

    questions.push({
      id: `div_${i}_${Date.now()}`,
      type: 'multiple_choice',
      question: `What is ${dividend} ÷ ${divisor}?`,
      options: shuffleArray([String(correct), ...wrongs.map(String)]),
      correctAnswer: String(correct),
      explanation: `${dividend} ÷ ${divisor} = ${correct}. Think: ${divisor} × ${correct} = ${dividend}!`,
      difficulty,
    });
  }
  return questions;
};

// Fraction Questions
const generateFractionQuestions = ({ difficulty, count }) => {
  const questions = [];
  const denominators = difficulty === 'easy' ? [2, 4] : difficulty === 'medium' ? [3, 5, 6] : [7, 8, 9, 10];

  for (let i = 0; i < count; i++) {
    const denom = denominators[Math.floor(Math.random() * denominators.length)];
    const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
    const num2 = Math.floor(Math.random() * (denom - num1)) + 1;
    const correctNumerator = num1 + num2;

    if (correctNumerator <= denom) {
      questions.push({
        id: `frac_${i}_${Date.now()}`,
        type: 'multiple_choice',
        question: `What is ${num1}/${denom} + ${num2}/${denom}?`,
        options: shuffleArray([
          `${correctNumerator}/${denom}`,
          `${correctNumerator + 1}/${denom}`,
          `${num1 + num2}/${denom * 2}`,
          `${correctNumerator - 1}/${denom}`,
        ]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
        correctAnswer: `${correctNumerator}/${denom}`,
        explanation: `${num1}/${denom} + ${num2}/${denom} = ${correctNumerator}/${denom}. Same denominator — just add numerators!`,
        difficulty,
      });
    }
  }
  return questions;
};

// Word Problems
const generateWordProblemQuestions = ({ difficulty, count, grade }) => {
  const templates = getWordProblemTemplates(difficulty, grade);
  const questions = [];

  for (let i = 0; i < Math.min(count, templates.length); i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const filled = fillTemplate(template);
    questions.push({
      id: `wp_${i}_${Date.now()}`,
      ...filled,
      difficulty,
    });
  }
  return questions;
};

// Advanced Word Problems (Grade 4-5)
const generateAdvancedWordProblemQuestions = ({ difficulty, count }) => {
  return generateWordProblemQuestions({ difficulty, count, grade: '5' });
};

// Place Value
const generatePlaceValueQuestions = ({ difficulty, count }) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const maxNum = difficulty === 'easy' ? 99 : difficulty === 'medium' ? 999 : 9999;
    const num = Math.floor(Math.random() * maxNum) + 10;
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;
    const hundreds = Math.floor(num / 100);

    const qType = Math.random() > 0.5 ? 'tens' : 'ones';
    const correct = qType === 'tens' ? tens : ones;
    const wrongs = generateWrongAnswers(correct, 3, 9);

    questions.push({
      id: `pv_${i}_${Date.now()}`,
      type: 'multiple_choice',
      question: `In the number ${num}, how many ${qType} are there?`,
      options: shuffleArray([String(correct), ...wrongs.map(String)]).slice(0, 4),
      correctAnswer: String(correct),
      explanation: `${num}: hundreds=${hundreds}, tens=${tens}, ones=${ones}. The ${qType} digit is ${correct}!`,
      difficulty,
    });
  }
  return questions;
};

// Mixed Math
const generateMixedMathQuestions = ({ difficulty, count, grade }) => {
  const generators = [
    generateAdditionQuestions,
    generateSubtractionQuestions,
    generateMultiplicationQuestions,
    generateDivisionQuestions,
  ];
  const allQuestions = [];
  generators.forEach(gen => {
    allQuestions.push(...gen({ difficulty, count: Math.ceil(count / 2), grade }));
  });
  return shuffleArray(allQuestions);
};

// ==============================
// READING QUESTION GENERATORS
// ==============================

const generateReadingQuestions = ({ grade, topic, difficulty, count }) => {
  const storyBank = getStoryBank(grade, difficulty);
  const questions = [];

  storyBank.forEach(story => {
    story.questions.forEach(q => questions.push({ ...q, context: story.text }));
  });

  return questions.length > 0 ? shuffleArray(questions).slice(0, count) : getDefaultReadingQuestions(count);
};

const getDefaultReadingQuestions = (count) => {
  const defaults = [
    {
      id: 'r_default_1',
      type: 'multiple_choice',
      question: '"The sun rises in the east every morning."\n\nWhere does the sun rise?',
      options: ['North', 'South', 'East', 'West'],
      correctAnswer: 'East',
      explanation: 'The sun always rises in the east — this is a fact about our Earth!',
      difficulty: 'easy',
    },
    {
      id: 'r_default_2',
      type: 'multiple_choice',
      question: '"Maya was sad because she lost her favorite book."\n\nHow did Maya feel?',
      options: ['Happy', 'Excited', 'Sad', 'Angry'],
      correctAnswer: 'Sad',
      explanation: 'Maya was sad because she lost something she loved — her favorite book!',
      difficulty: 'easy',
    },
    {
      id: 'r_default_3',
      type: 'multiple_choice',
      question: '"First, Tom put on his shoes. Then he tied the laces. Finally, he was ready."\n\nWhat did Tom do LAST?',
      options: ['Put on shoes', 'Tied laces', 'Was ready to go', 'Opened the door'],
      correctAnswer: 'Was ready to go',
      explanation: 'Finally means last. Tom was ready to go — that was the last thing!',
      difficulty: 'easy',
    },
  ];
  return shuffleArray(defaults).slice(0, count);
};

// ==============================
// HELPER FUNCTIONS
// ==============================

const generateWrongAnswers = (correct, count, max) => {
  const wrongs = new Set();
  let attempts = 0;
  while (wrongs.size < count && attempts < 50) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const candidate = Math.random() > 0.5 ? correct + offset : Math.max(1, correct - offset);
    if (candidate !== correct && candidate > 0) {
      wrongs.add(candidate);
    }
    attempts++;
  }
  return Array.from(wrongs);
};

const getAdditionExplanation = (a, b, result) => {
  if (a + b < 20) return `Count up from ${a}: ${Array.from({length: b}, (_, i) => a + i + 1).join(', ')}`;
  return `${a} + ${b} = ${result}`;
};

const getWordProblemTemplates = (difficulty, grade) => {
  const easy = [
    { text: 'Jake has {a} apples. He gets {b} more. How many does he have?', op: '+' },
    { text: 'There are {a} birds. {b} fly away. How many are left?', op: '-' },
    { text: 'A store has {a} red pens and {b} blue pens. How many pens total?', op: '+' },
  ];
  const medium = [
    { text: '{a} students are in a class. {b} go home. How many remain?', op: '-' },
    { text: 'A baker makes {a} cookies in the morning and {b} in the afternoon. Total?', op: '+' },
  ];
  const hard = [
    { text: 'A train goes {a} km per hour for {b} hours. How far does it travel?', op: '*' },
    { text: '{a} children share {b} cookies equally. How many does each child get?', op: '/' },
  ];
  return difficulty === 'easy' ? easy : difficulty === 'medium' ? medium : hard;
};

const fillTemplate = (template) => {
  const maxNums = { '+': 50, '-': 50, '*': 12, '/': 10 };
  const max = maxNums[template.op] || 50;
  const a = Math.floor(Math.random() * max) + 2;
  const b = template.op === '-' ? Math.floor(Math.random() * (a - 1)) + 1
    : template.op === '/' ? (a * (Math.floor(Math.random() * 8) + 2))
    : Math.floor(Math.random() * max) + 2;

  const correctNum = template.op === '+' ? a + b
    : template.op === '-' ? a - b
    : template.op === '*' ? a * b
    : a; // Division: a is dividend/divisor combo

  const correct = String(correctNum);
  const wrongs = generateWrongAnswers(correctNum, 3, max * 2);

  return {
    type: 'multiple_choice',
    question: template.text.replace('{a}', a).replace('{b}', b),
    options: shuffleArray([correct, ...wrongs.map(String)]).slice(0, 4),
    correctAnswer: correct,
    explanation: `${a} ${template.op} ${b} = ${correct}`,
  };
};

const getStoryBank = (grade, difficulty) => [
  {
    text: 'The cat sat on the warm mat near the window. It purred softly and watched birds outside.',
    questions: [
      { id: 'rb_1', type: 'multiple_choice', question: 'Where was the cat sitting?', options: ['On a chair', 'On the mat', 'Near a tree', 'On a bed'], correctAnswer: 'On the mat', explanation: 'The story says "the cat sat on the warm mat"!', difficulty: 'easy' },
      { id: 'rb_2', type: 'multiple_choice', question: 'What was the cat watching?', options: ['Fish', 'Dogs', 'Birds', 'Children'], correctAnswer: 'Birds', explanation: 'The cat was watching birds outside the window!', difficulty: 'easy' },
    ],
  },
  {
    text: 'Sara went to the library every Saturday. She loved reading adventure books. One day she found a mystery book about a lost treasure.',
    questions: [
      { id: 'rb_3', type: 'multiple_choice', question: 'When did Sara go to the library?', options: ['Every Sunday', 'Every Saturday', 'Every Friday', 'Every Monday'], correctAnswer: 'Every Saturday', explanation: '"She went to the library every Saturday" — that tells us when!', difficulty: 'easy' },
      { id: 'rb_4', type: 'multiple_choice', question: 'What kind of books did Sara love?', options: ['Science books', 'Cooking books', 'Adventure books', 'Sports books'], correctAnswer: 'Adventure books', explanation: 'Sara "loved reading adventure books" — it says so directly!', difficulty: 'easy' },
    ],
  },
];
