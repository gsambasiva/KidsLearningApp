/**
 * SmartKids Learning App - Local Questions Database
 * Built-in questions for offline mode and fallback
 * Organized by: subject → topic → difficulty → questions[]
 */

const LOCAL_QUESTIONS = {
  math: {
    counting: {
      easy: [
        { id: 'mc_e1', grades: ['K'], type: 'multiple_choice', question: 'How many apples are there? 🍎🍎🍎', options: ['2', '3', '4', '5'], correctAnswer: '3', explanation: 'Count the apples one by one: 1, 2, 3. There are 3 apples!' },
        { id: 'mc_e2', grades: ['K'], type: 'multiple_choice', question: 'What number comes after 5?', options: ['4', '5', '6', '7'], correctAnswer: '6', explanation: 'Counting forward: ...4, 5, 6. Six comes after five!' },
        { id: 'mc_e3', grades: ['K'], type: 'multiple_choice', question: 'How many fingers do you have on one hand?', options: ['4', '5', '6', '7'], correctAnswer: '5', explanation: 'Count your fingers: 1, 2, 3, 4, 5. Five fingers on one hand!' },
        { id: 'mc_e4', grades: ['K'], type: 'multiple_choice', question: 'Which number is the smallest? 3, 7, 1, 9', options: ['3', '7', '1', '9'], correctAnswer: '1', explanation: '1 is the smallest number. Order: 1, 3, 7, 9' },
        { id: 'mc_e5', grades: ['K'], type: 'multiple_choice', question: 'Count: ⭐⭐⭐⭐⭐⭐', options: ['4', '5', '6', '7'], correctAnswer: '6', explanation: 'Count each star: 1, 2, 3, 4, 5, 6. There are 6 stars!' },
      ],
      medium: [
        { id: 'mc_m1', grades: ['K', '1'], type: 'multiple_choice', question: 'What number comes between 8 and 10?', options: ['7', '9', '11', '6'], correctAnswer: '9', explanation: 'Count in order: 8, 9, 10. Nine is between 8 and 10!' },
        { id: 'mc_m2', grades: ['K', '1'], type: 'fill_blank', question: 'Count by 2s: 2, 4, ___, 8, 10', correctAnswer: '6', hint: 'Add 2 each time', explanation: '2, 4, 6, 8, 10 — counting by 2s!' },
      ],
    },
    addition: {
      easy: [
        { id: 'add_e1', grades: ['1', '2'], type: 'multiple_choice', question: 'What is 3 + 4?', options: ['6', '7', '8', '9'], correctAnswer: '7', explanation: '3 + 4 = 7. If you have 3 apples and get 4 more, you have 7!' },
        { id: 'add_e2', grades: ['1', '2'], type: 'multiple_choice', question: 'What is 5 + 6?', options: ['10', '11', '12', '13'], correctAnswer: '11', explanation: '5 + 6 = 11. Count up from 5: 6, 7, 8, 9, 10, 11!' },
        { id: 'add_e3', grades: ['1', '2'], type: 'fill_blank', question: '8 + ___ = 12', correctAnswer: '4', hint: 'What number plus 8 makes 12?', explanation: '8 + 4 = 12. Count up from 8 four times!' },
        { id: 'add_e4', grades: ['1', '2'], type: 'multiple_choice', question: 'What is 2 + 9?', options: ['10', '11', '12', '13'], correctAnswer: '11', explanation: '2 + 9 = 11. Adding the bigger number first: 9 + 2 = 11' },
        { id: 'add_e5', grades: ['1', '2'], type: 'multiple_choice', question: 'Tom has 6 toy cars. He gets 3 more. How many does he have?', options: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '6 + 3 = 9 toy cars total!' },
      ],
      medium: [
        { id: 'add_m1', grades: ['2', '3'], type: 'multiple_choice', question: 'What is 25 + 37?', options: ['52', '62', '72', '42'], correctAnswer: '62', explanation: '25 + 37: Add ones: 5+7=12, carry 1. Add tens: 2+3+1=6. Answer: 62!' },
        { id: 'add_m2', grades: ['2', '3'], type: 'fill_blank', question: '45 + ___ = 80', correctAnswer: '35', hint: 'What do you add to 45 to get 80?', explanation: '80 - 45 = 35. So 45 + 35 = 80!' },
        { id: 'add_m3', grades: ['2', '3'], type: 'multiple_choice', question: 'A baker makes 48 cookies in the morning and 56 in the afternoon. How many total?', options: ['94', '104', '114', '84'], correctAnswer: '104', explanation: '48 + 56 = 104 cookies total!' },
      ],
      hard: [
        { id: 'add_h1', grades: ['3', '4'], type: 'multiple_choice', question: 'What is 347 + 589?', options: ['826', '836', '936', '916'], correctAnswer: '936', explanation: '347 + 589: 7+9=16 (write 6 carry 1), 4+8+1=13 (write 3 carry 1), 3+5+1=9. Answer: 936!' },
        { id: 'add_h2', grades: ['4', '5'], type: 'fill_blank', question: '1,256 + ___ = 2,000', correctAnswer: '744', hint: 'Subtract 1,256 from 2,000', explanation: '2,000 - 1,256 = 744. So 1,256 + 744 = 2,000!' },
      ],
    },
    subtraction: {
      easy: [
        { id: 'sub_e1', grades: ['1', '2'], type: 'multiple_choice', question: 'What is 10 - 4?', options: ['5', '6', '7', '8'], correctAnswer: '6', explanation: '10 - 4 = 6. If you start with 10 and remove 4, you have 6 left!' },
        { id: 'sub_e2', grades: ['1', '2'], type: 'multiple_choice', question: 'What is 15 - 7?', options: ['6', '7', '8', '9'], correctAnswer: '8', explanation: '15 - 7 = 8. Count back from 15 seven times!' },
        { id: 'sub_e3', grades: ['1', '2'], type: 'fill_blank', question: '12 - ___ = 5', correctAnswer: '7', hint: 'What do you subtract from 12 to get 5?', explanation: '12 - 7 = 5. So the answer is 7!' },
      ],
      medium: [
        { id: 'sub_m1', grades: ['2', '3'], type: 'multiple_choice', question: 'What is 73 - 28?', options: ['35', '45', '55', '65'], correctAnswer: '45', explanation: '73 - 28 = 45. Borrow from tens: 13-8=5, 6-2=4. Answer: 45!' },
        { id: 'sub_m2', grades: ['3', '4'], type: 'multiple_choice', question: 'Sarah had 84 stickers. She gave 37 to her friend. How many does she have left?', options: ['37', '47', '57', '67'], correctAnswer: '47', explanation: '84 - 37 = 47 stickers remaining!' },
      ],
    },
    multiplication: {
      easy: [
        { id: 'mul_e1', grades: ['3', '4'], type: 'multiple_choice', question: 'What is 3 × 4?', options: ['9', '12', '15', '7'], correctAnswer: '12', explanation: '3 × 4 = 12. Think of it as 3 groups of 4: 4 + 4 + 4 = 12!' },
        { id: 'mul_e2', grades: ['3', '4'], type: 'multiple_choice', question: 'What is 6 × 7?', options: ['36', '42', '48', '54'], correctAnswer: '42', explanation: '6 × 7 = 42. This is an important fact to memorize!' },
        { id: 'mul_e3', grades: ['3', '4'], type: 'fill_blank', question: '5 × ___ = 35', correctAnswer: '7', hint: 'Think of the 5 times table', explanation: '5 × 7 = 35. Count by 5s: 5, 10, 15, 20, 25, 30, 35!' },
        { id: 'mul_e4', grades: ['3'], type: 'multiple_choice', question: 'There are 4 bags with 6 apples each. How many apples in total?', options: ['20', '24', '28', '32'], correctAnswer: '24', explanation: '4 × 6 = 24 apples total!' },
        { id: 'mul_e5', grades: ['3', '4'], type: 'multiple_choice', question: 'What is 9 × 9?', options: ['72', '81', '90', '64'], correctAnswer: '81', explanation: '9 × 9 = 81. A fun trick: 9×9 = 80+1 = 81!' },
      ],
      medium: [
        { id: 'mul_m1', grades: ['4', '5'], type: 'multiple_choice', question: 'What is 12 × 8?', options: ['86', '96', '106', '76'], correctAnswer: '96', explanation: '12 × 8 = (10×8) + (2×8) = 80 + 16 = 96!' },
        { id: 'mul_m2', grades: ['4', '5'], type: 'fill_blank', question: '___ × 13 = 91', correctAnswer: '7', hint: 'Try dividing 91 by 13', explanation: '7 × 13 = 91. Verify: 7×10 + 7×3 = 70 + 21 = 91!' },
      ],
      hard: [
        { id: 'mul_h1', grades: ['5'], type: 'multiple_choice', question: 'What is 24 × 15?', options: ['360', '320', '380', '340'], correctAnswer: '360', explanation: '24 × 15 = 24 × 10 + 24 × 5 = 240 + 120 = 360!' },
      ],
    },
    division: {
      easy: [
        { id: 'div_e1', grades: ['3', '4'], type: 'multiple_choice', question: 'What is 20 ÷ 4?', options: ['4', '5', '6', '7'], correctAnswer: '5', explanation: '20 ÷ 4 = 5. Share 20 into 4 equal groups of 5!' },
        { id: 'div_e2', grades: ['3', '4'], type: 'multiple_choice', question: 'What is 36 ÷ 9?', options: ['3', '4', '5', '6'], correctAnswer: '4', explanation: '36 ÷ 9 = 4. Think: 9 × ? = 36, answer is 4!' },
        { id: 'div_e3', grades: ['3', '4'], type: 'fill_blank', question: '45 ÷ ___ = 9', correctAnswer: '5', hint: 'Think of the multiplication fact', explanation: '45 ÷ 5 = 9, because 5 × 9 = 45!' },
      ],
      medium: [
        { id: 'div_m1', grades: ['4', '5'], type: 'multiple_choice', question: '72 cookies are shared equally among 8 children. How many each?', options: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '72 ÷ 8 = 9 cookies each!' },
      ],
    },
    fractions: {
      easy: [
        { id: 'frac_e1', grades: ['3', '4', '5'], type: 'multiple_choice', question: 'What fraction represents "one half"?', options: ['1/3', '1/2', '1/4', '2/3'], correctAnswer: '1/2', explanation: '1/2 means 1 part out of 2 equal parts. That\'s one half!' },
        { id: 'frac_e2', grades: ['4', '5'], type: 'multiple_choice', question: 'A pizza is cut into 8 slices. You eat 3. What fraction did you eat?', options: ['3/5', '5/8', '3/8', '1/3'], correctAnswer: '3/8', explanation: '3/8 — you ate 3 out of 8 equal slices!' },
        { id: 'frac_e3', grades: ['4', '5'], type: 'multiple_choice', question: 'Which fraction is equal to 1/2?', options: ['2/6', '3/6', '2/8', '3/9'], correctAnswer: '3/6', explanation: '3/6 = 1/2. Both numerator and denominator are multiplied by 3!' },
      ],
      medium: [
        { id: 'frac_m1', grades: ['4', '5'], type: 'multiple_choice', question: 'What is 1/4 + 2/4?', options: ['2/4', '3/4', '3/8', '1/2'], correctAnswer: '3/4', explanation: '1/4 + 2/4 = 3/4. Add the numerators, keep the denominator!' },
        { id: 'frac_m2', grades: ['5'], type: 'fill_blank', question: '3/5 + 1/5 = ___', correctAnswer: '4/5', hint: 'Add the top numbers', explanation: '3/5 + 1/5 = 4/5. The denominators are the same, just add numerators!' },
      ],
      hard: [
        { id: 'frac_h1', grades: ['5'], type: 'multiple_choice', question: 'What is 1/3 + 1/4?', options: ['2/7', '7/12', '5/12', '2/12'], correctAnswer: '7/12', explanation: 'Common denominator is 12. 1/3 = 4/12, 1/4 = 3/12. 4/12 + 3/12 = 7/12!' },
      ],
    },
    word_problems: {
      easy: [
        { id: 'wp_e1', grades: ['2', '3'], type: 'multiple_choice', question: 'Jake has 12 marbles. He gives 5 to his sister and buys 8 more. How many does he have?', options: ['13', '15', '17', '19'], correctAnswer: '15', explanation: '12 - 5 = 7, then 7 + 8 = 15 marbles!' },
        { id: 'wp_e2', grades: ['3', '4'], type: 'multiple_choice', question: 'A class has 25 students. 12 are boys. How many are girls?', options: ['11', '12', '13', '14'], correctAnswer: '13', explanation: '25 - 12 = 13 girls in the class!' },
      ],
      medium: [
        { id: 'wp_m1', grades: ['4', '5'], type: 'multiple_choice', question: 'Train A goes 60 mph for 3 hours. Train B goes 45 mph for 4 hours. Which travels farther?', options: ['Train A (180 miles)', 'Train B (180 miles)', 'They are equal', 'Train A (160 miles)'], correctAnswer: 'Train A (180 miles)', explanation: 'Train A: 60×3 = 180 miles. Train B: 45×4 = 180 miles. They are equal! Wait — both are 180!' },
      ],
    },
  },
  reading: {
    sight_words: {
      easy: [
        { id: 'sw_e1', grades: ['K', '1'], type: 'multiple_choice', question: 'Which word means "a large body of salt water"?', options: ['lake', 'river', 'ocean', 'pond'], correctAnswer: 'ocean', explanation: 'An ocean is the largest body of salt water on Earth!' },
        { id: 'sw_e2', grades: ['K', '1'], type: 'multiple_choice', question: 'What is the opposite of "happy"?', options: ['glad', 'sad', 'mad', 'bad'], correctAnswer: 'sad', explanation: 'Sad is the opposite of happy. Happy = feeling good, Sad = feeling not good!' },
      ],
    },
    comprehension_2: {
      easy: [
        {
          id: 'comp_e1',
          grades: ['2', '3'],
          type: 'multiple_choice',
          question: 'Read: "The cat sat on the mat. It was soft and warm. The cat purred happily."\n\nHow did the cat feel?',
          options: ['Scared', 'Hungry', 'Happy', 'Angry'],
          correctAnswer: 'Happy',
          explanation: 'The story says the cat "purred happily" — purring means a cat is content and happy!'
        },
        {
          id: 'comp_e2',
          grades: ['2', '3'],
          type: 'multiple_choice',
          question: 'Read: "Sam woke up early. He made his bed and ate breakfast. Then he brushed his teeth."\n\nWhat did Sam do FIRST?',
          options: ['Ate breakfast', 'Made his bed', 'Woke up early', 'Brushed his teeth'],
          correctAnswer: 'Woke up early',
          explanation: 'First means what happened at the beginning. Sam woke up first!'
        },
      ],
      medium: [
        {
          id: 'comp_m1',
          grades: ['3', '4'],
          type: 'multiple_choice',
          question: 'Read: "The library was quiet. Maria searched the shelves carefully. She found the last book about dinosaurs and smiled."\n\nWhy did Maria smile?',
          options: [
            'She liked the library',
            'She found the dinosaur book she wanted',
            'The library was quiet',
            'She finished her homework'
          ],
          correctAnswer: 'She found the dinosaur book she wanted',
          explanation: 'Maria smiled because she found what she was looking for — the dinosaur book!'
        },
      ],
    },
    stories_3: {
      easy: [
        {
          id: 'st3_e1',
          grades: ['3', '4', '5'],
          type: 'multiple_choice',
          question: '"The tortoise moved slowly, but never stopped. The hare ran fast but rested often. In the end, the tortoise won the race."\n\nWhat is the main lesson of this story?',
          options: [
            'Fast animals always win',
            'Slow and steady wins the race',
            'Tortoises are better than hares',
            'Rest is important'
          ],
          correctAnswer: 'Slow and steady wins the race',
          explanation: 'This is the Tortoise and the Hare! The moral is: being consistent and never giving up is better than being fast but lazy!'
        },
      ],
    },
    vocabulary_1: {
      easy: [
        { id: 'voc_e1', grades: ['1', '2'], type: 'multiple_choice', question: 'What does "enormous" mean?', options: ['very small', 'very big', 'very fast', 'very old'], correctAnswer: 'very big', explanation: 'Enormous means very, very big! An elephant is enormous!' },
        { id: 'voc_e2', grades: ['1', '2'], type: 'multiple_choice', question: 'What does "delicious" mean?', options: ['tastes bad', 'feels soft', 'tastes really good', 'looks pretty'], correctAnswer: 'tastes really good', explanation: 'Delicious means it tastes really, really good! Like your favorite food!' },
        { id: 'voc_e3', grades: ['2', '3'], type: 'fill_blank', question: 'The brave firefighter ___ the house from the fire.', correctAnswer: 'saved', hint: 'What did the firefighter do to protect the house?', explanation: 'Saved means protected or rescued from danger!' },
      ],
    },
  },
};

export default LOCAL_QUESTIONS;
