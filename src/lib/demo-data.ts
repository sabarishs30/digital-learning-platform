import { User, Subject, Material, Quiz, QuizResult, Progress, Reward } from "@/types";

// Realistic Demo Users with Indian school names
export const demoUsers: User[] = [
  {
    id: "student-1",
    name: "Arun Kumar",
    email: "student@example.com",
    role: "student",
    className: "Class 10",
    school: "Government High School, Rampur",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "student-2",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "student",
    className: "Class 10",
    school: "Government High School, Rampur",
    createdAt: "2026-01-16T10:00:00Z",
  },
  {
    id: "student-3",
    name: "Karthik Raja",
    email: "karthik@example.com",
    role: "student",
    className: "Class 10",
    school: "Government High School, Rampur",
    createdAt: "2026-01-18T10:00:00Z",
  },
  {
    id: "student-4",
    name: "Meena Devi",
    email: "meena@example.com",
    role: "student",
    className: "Class 10",
    school: "Government High School, Rampur",
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "admin-1",
    name: "Mrs. Priya Sharma",
    email: "admin@example.com",
    role: "admin",
    className: "",
    school: "Government High School, Rampur",
    createdAt: "2025-08-01T10:00:00Z",
  },
];

// 5 Core School Subjects
export const demoSubjects: Subject[] = [
  {
    id: "sub-1",
    name: "Science",
    description: "Explore the natural world through biology, physics, and chemistry. Learn about the human body, organ systems, forces, and ecosystems.",
    className: "Class 10",
    image: "🔬",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "sub-2",
    name: "Mathematics",
    description: "Master arithmetic, fractions, algebra, geometry, and real-world problem solving essential for daily life and exams.",
    className: "Class 10",
    image: "📐",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "sub-3",
    name: "English",
    description: "Improve reading comprehension, grammar, parts of speech, vocabulary, and confident writing skills.",
    className: "Class 10",
    image: "📖",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "sub-4",
    name: "Social Science",
    description: "Learn history, geography, civics, and our constitution. Explore India's struggle for independence and modern democracy.",
    className: "Class 10",
    image: "🌍",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "sub-5",
    name: "Computer Science",
    description: "Understand computer hardware, software, digital literacy, typing, internet safety, and logical thinking.",
    className: "Class 10",
    image: "💻",
    createdAt: "2026-01-10T10:00:00Z",
  },
];

// Realistic Learning Materials
export const demoMaterials: Material[] = [
  {
    id: "mat-1",
    subjectId: "sub-1",
    title: "Human Body - Major Organ Systems",
    description: "Learn about the major organs of the human body and their functions.",
    type: "note",
    content: `# The Human Body - Major Organ Systems

The human body is an amazing living machine made up of millions of cells, tissues, and specialized organs working together.

---

## 1. The Digestive System
The digestive system processes food so our body can absorb energy, vitamins, and minerals.
- **Mouth**: Food is chewed by teeth and mixed with saliva containing enzymes.
- **Esophagus**: The food pipe carries chewed food to the stomach via peristalsis.
- **Stomach**: Secretes hydrochloric acid and digestive enzymes to break down proteins.
- **Small Intestine**: The primary site where nutrients and water are absorbed into the bloodstream.
- **Large Intestine**: Absorbs remaining water and forms solid waste.
- **Liver & Pancreas**: Produce bile and enzymes essential for fat digestion.

---

## 2. The Respiratory System
The respiratory system brings life-giving oxygen into the bloodstream and removes waste carbon dioxide.
- **Nose & Nasal Cavity**: Filters, warms, and humidifies inhaled air.
- **Trachea (Windpipe)**: Sturdy tube lined with cilia that guides air into the chest.
- **Lungs**: Spongy paired organs containing millions of microscopic air sacs called **alveoli**.
- **Diaphragm**: The large, dome-shaped muscle beneath the lungs that contracts to draw in air.

---

## 3. The Circulatory System
Transports oxygen, nutrients, hormones, and waste products across the entire body.
- **Heart**: A muscular pump with 4 chambers (2 atria, 2 ventricles) that beats approximately 100,000 times a day.
- **Arteries**: Thick-walled vessels carrying oxygen-rich blood **away** from the heart.
- **Veins**: Carry oxygen-poor blood back toward the heart (with one-way valves).
- **Capillaries**: Microscopic blood vessels where nutrients and gases transfer to cells.

---

## 4. The Nervous System
The communication network that controls and coordinates all physical activities and thoughts.
- **Brain**: The master control center containing about 86 billion neurons. Divided into the cerebrum (thinking), cerebellum (balance and coordination), and brainstem (involuntary functions like breathing).
- **Spinal Cord**: The central highway transmitting nerve impulses between the brain and body.
- **Nerves**: Fibers carrying electrical messages throughout muscles and skin.

---

## 5. The Skeletal System
Provides physical structure, protection for delicate organs, and anchor points for muscles.
- An adult human body contains exactly **206 bones**.
- Bones also produce blood cells inside bone marrow and store minerals like calcium.`,
    createdAt: "2026-02-01T10:00:00Z",
    createdBy: "admin-1",
  },
  {
    id: "mat-2",
    subjectId: "sub-2",
    title: "Fractions - Basics, Addition and Comparison",
    description: "Learn how to add, subtract and compare fractions.",
    type: "note",
    content: `# Fractions - Understanding Parts of a Whole

A fraction represents a part of a whole quantity or a division of two integers.

---

## 1. Anatomy of a Fraction
A fraction is written as **a / b**:
- **Numerator (Top)**: How many equal parts are taken or considered.
- **Denominator (Bottom)**: The total number of equal parts the whole is divided into.
- *Example*: In 3/4, 3 is the numerator and 4 is the denominator.

---

## 2. Types of Fractions
- **Proper Fractions**: Numerator is smaller than denominator (e.g., 2/5, 3/8). Value is less than 1.
- **Improper Fractions**: Numerator is equal to or greater than denominator (e.g., 7/4, 5/3).
- **Mixed Fractions**: A combination of a whole number and a proper fraction (e.g., 1 ¾).

---

## 3. Adding and Subtracting Fractions
### Case A: Same Denominators (Like Fractions)
Add or subtract the numerators directly; keep the denominator unchanged.
- 1/5 + 2/5 = (1 + 2) / 5 = **3/5**
- 5/7 - 2/7 = (5 - 2) / 7 = **3/7**

### Case B: Different Denominators (Unlike Fractions)
1. Find the Least Common Multiple (LCM) of the denominators.
2. Convert both fractions into equivalent fractions with that common denominator.
3. Add or subtract the new numerators.
- *Example*: 1/2 + 1/3
  - LCM of 2 and 3 is 6.
  - 1/2 = 3/6, 1/3 = 2/6.
  - 3/6 + 2/6 = **5/6**.`,
    createdAt: "2026-02-02T10:00:00Z",
    createdBy: "admin-1",
  },
  {
    id: "mat-3",
    subjectId: "sub-3",
    title: "Parts of Speech - English Grammar Basics",
    description: "Learn about nouns, verbs, adjectives and other basic parts of speech.",
    type: "note",
    content: `# Parts of Speech - Building Blocks of English

Every word in a sentence performs a specific grammatical role. These roles are known as the **8 Parts of Speech**.

---

## 1. Noun
A noun is a word that names a person, place, animal, thing, or idea.
- *Examples*: Arun, school, book, tiger, honesty, village.
- *Sentence*: **Arun** walked to the **school**.

## 2. Pronoun
A pronoun replaces a noun to prevent repetitive phrasing.
- *Examples*: he, she, it, they, we, you, I.
- *Sentence*: Priya is studying. **She** wants to be a doctor.

## 3. Verb
A verb expresses an action, occurrence, or state of being.
- *Examples*: read, write, run, learn, is, are, have.
- *Sentence*: The students **solve** the math problems diligently.

## 4. Adjective
An adjective describes, qualifies, or gives more detail about a noun or pronoun.
- *Examples*: bright, quick, green, tall, five, intelligent.
- *Sentence*: Meena answered with a **smart** solution.

## 5. Adverb
An adverb modifies a verb, adjective, or another adverb, often indicating how, when, or where.
- *Examples*: quickly, softly, yesterday, very, carefully.
- *Sentence*: The child read the lesson **carefully**.

## 6. Preposition
Shows position, direction, or time relationship between nouns.
- *Examples*: in, on, at, under, through, between.
- *Sentence*: The notebook is **on** the desk.

## 7. Conjunction
Connects words, phrases, or clauses together.
- *Examples*: and, but, because, or, although.
- *Sentence*: He studied hard **because** exams were approaching.

## 8. Interjection
A word or phrase used to express sudden emotion or feeling.
- *Examples*: Wow!, Oh!, Hurray!, Alas!`,
    createdAt: "2026-02-03T10:00:00Z",
    createdBy: "admin-1",
  },
  {
    id: "mat-4",
    subjectId: "sub-4",
    title: "Indian Freedom Movement",
    description: "Key events, leaders, and movements in India's struggle for independence.",
    type: "note",
    content: `# Indian Freedom Movement

India's struggle for freedom was an inspiring journey of courage, unity, and non-violent resistance.

---

## Major Milestones
- **1857**: The First War of Independence (Sepoy Mutiny).
- **1885**: Foundation of the Indian National Congress.
- **1919**: Rowlatt Act and the tragic Jallianwala Bagh Massacre.
- **1920**: Non-Cooperation Movement initiated by Mahatma Gandhi.
- **1930**: The historic Salt March (Dandi March) demanding civil rights.
- **1942**: The Quit India Movement launched nationwide.
- **15 August 1947**: India triumphs and attains sovereign independence.

---

## Renowned National Leaders
- **Mahatma Gandhi**: Champion of Truth (Satya) and Non-violence (Ahimsa).
- **Subhash Chandra Bose**: Founded the Indian National Army (Azad Hind Fauj).
- **Bhagat Singh**: Youthful revolutionary hero who inspired generations.
- **Sardar Vallabhbhai Patel**: The Iron Man of India who united the princely states.`,
    createdAt: "2026-02-04T10:00:00Z",
    createdBy: "admin-1",
  },
  {
    id: "mat-5",
    subjectId: "sub-5",
    title: "Introduction to Computers",
    description: "Basics of computer hardware, software, and how computers work.",
    type: "note",
    content: `# Introduction to Computers

A computer is an electronic data processing machine that accepts input, processes it logically, and produces useful output.

---

## 1. Fundamental Hardware Units
- **CPU (Central Processing Unit)**: The brain of the computer that performs calculations and logical comparisons.
- **RAM (Random Access Memory)**: Fast, temporary working memory used while programs are active.
- **Storage (Hard Disk / SSD)**: Non-volatile long-term storage where files and operating systems are saved.
- **Input Devices**: Keyboard, mouse, microphone.
- **Output Devices**: Monitor, printer, speakers.

---

## 2. Software Categories
- **System Software**: Operating systems such as Windows, Linux, and Android that manage hardware.
- **Application Software**: Tools like web browsers, word processors, and educational apps that help users complete tasks.`,
    createdAt: "2026-02-05T10:00:00Z",
    createdBy: "admin-1",
  },
];

// Quizzes (Human Body Quiz has exactly 10 questions)
export const demoQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Human Body Quiz",
    description: "Test your knowledge about the human body and its major organs. 10 questions covering organ functions, bones, heart, brain, and digestion.",
    subjectId: "sub-1",
    className: "Class 10",
    questions: [
      {
        id: "q1",
        question: "How many bones are in an adult human body?",
        options: ["106", "206", "306", "150"],
        correctAnswer: 1, // 206
      },
      {
        id: "q2",
        question: "Which organ acts as the main control center of the nervous system?",
        options: ["Heart", "Liver", "Brain", "Lungs"],
        correctAnswer: 2, // Brain
      },
      {
        id: "q3",
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Liver", "Brain", "Skin"],
        correctAnswer: 3, // Skin
      },
      {
        id: "q4",
        question: "Where does most nutrient absorption take place during digestion?",
        options: ["Stomach", "Small Intestine", "Large Intestine", "Mouth"],
        correctAnswer: 1, // Small Intestine
      },
      {
        id: "q5",
        question: "Approximately how many times does an adult human heart beat per day?",
        options: ["10,000", "50,000", "100,000", "200,000"],
        correctAnswer: 2, // 100,000
      },
      {
        id: "q6",
        question: "Which part of the brain controls body balance, posture, and coordination?",
        options: ["Cerebrum", "Cerebellum", "Medulla", "Spinal Cord"],
        correctAnswer: 1, // Cerebellum
      },
      {
        id: "q7",
        question: "What essential gas do human lungs absorb from inhaled air?",
        options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
        correctAnswer: 2, // Oxygen
      },
      {
        id: "q8",
        question: "How many major organ systems does the human body have?",
        options: ["5", "8", "11", "15"],
        correctAnswer: 2, // 11
      },
      {
        id: "q9",
        question: "Which blood vessels carry oxygenated blood AWAY from the heart to the body?",
        options: ["Veins", "Capillaries", "Arteries", "Lymphatics"],
        correctAnswer: 2, // Arteries
      },
      {
        id: "q10",
        question: "What dome-shaped muscle located below the lungs is primarily responsible for breathing?",
        options: ["Biceps", "Triceps", "Diaphragm", "Pectoral"],
        correctAnswer: 2, // Diaphragm
      },
    ],
    createdAt: "2026-03-01T10:00:00Z",
    createdBy: "admin-1",
  },
  {
    id: "quiz-2",
    title: "Fractions Quiz",
    description: "Test your understanding of numerators, denominators, and adding simple fractions.",
    subjectId: "sub-2",
    className: "Class 10",
    questions: [
      {
        id: "q11",
        question: "What is 1/5 + 2/5?",
        options: ["3/10", "3/5", "2/5", "1/5"],
        correctAnswer: 1,
      },
      {
        id: "q12",
        question: "In the fraction 3/8, what is the number 8 called?",
        options: ["Numerator", "Denominator", "Quotient", "Remainder"],
        correctAnswer: 1,
      },
      {
        id: "q13",
        question: "What is 1/2 expressed as an equivalent fraction with denominator 6?",
        options: ["2/6", "3/6", "4/6", "5/6"],
        correctAnswer: 1,
      },
      {
        id: "q14",
        question: "Which of the following is a proper fraction?",
        options: ["5/3", "4/4", "2/7", "9/2"],
        correctAnswer: 2,
      },
      {
        id: "q15",
        question: "What is 3/4 - 1/4?",
        options: ["2/4 (or 1/2)", "1/4", "4/4", "2/8"],
        correctAnswer: 0,
      },
    ],
    createdAt: "2026-03-05T10:00:00Z",
    createdBy: "admin-1",
  },
  {
    id: "quiz-3",
    title: "Parts of Speech Quiz",
    description: "Identify nouns, verbs, adjectives, and prepositions in common sentences.",
    subjectId: "sub-3",
    className: "Class 10",
    questions: [
      {
        id: "q16",
        question: "Identify the noun in this sentence: 'Arun reads every evening.'",
        options: ["Arun", "reads", "every", "evening"],
        correctAnswer: 0,
      },
      {
        id: "q17",
        question: "What part of speech is 'swiftly' in 'The deer ran swiftly'?",
        options: ["Noun", "Adjective", "Adverb", "Verb"],
        correctAnswer: 2,
      },
      {
        id: "q18",
        question: "Which word is a verb?",
        options: ["Beautiful", "Learn", "School", "Honest"],
        correctAnswer: 1,
      },
      {
        id: "q19",
        question: "In the phrase 'bright sunshine', what part of speech is 'bright'?",
        options: ["Noun", "Pronoun", "Adjective", "Conjunction"],
        correctAnswer: 2,
      },
      {
        id: "q20",
        question: "What part of speech connects words like 'and', 'but', and 'because'?",
        options: ["Preposition", "Conjunction", "Interjection", "Adverb"],
        correctAnswer: 1,
      },
    ],
    createdAt: "2026-03-10T10:00:00Z",
    createdBy: "admin-1",
  },
];

// Baseline demo quiz results for student-1 and classmates
export const demoQuizResults: QuizResult[] = [
  {
    id: "res-math-1",
    studentId: "student-1",
    studentName: "Arun Kumar",
    quizId: "quiz-2",
    quizTitle: "Fractions Quiz",
    subjectId: "sub-2",
    subjectName: "Mathematics",
    totalQuestions: 5,
    correctAnswers: 4,
    wrongAnswers: 1,
    percentage: 70,
    rewardEarned: "None",
    completedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "res-demo-2",
    studentId: "student-2",
    studentName: "Priya Sharma",
    quizId: "quiz-1",
    quizTitle: "Human Body Quiz",
    subjectId: "sub-1",
    subjectName: "Science",
    totalQuestions: 10,
    correctAnswers: 9,
    wrongAnswers: 1,
    percentage: 90,
    rewardEarned: "Excellent Learner",
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "res-demo-3",
    studentId: "student-3",
    studentName: "Karthik Raja",
    quizId: "quiz-1",
    quizTitle: "Human Body Quiz",
    subjectId: "sub-1",
    subjectName: "Science",
    totalQuestions: 10,
    correctAnswers: 8,
    wrongAnswers: 2,
    percentage: 80,
    rewardEarned: "Great Achievement",
    completedAt: new Date(Date.now() - 120000000).toISOString(),
  },
];

// Baseline progress records
export const demoProgress: Progress[] = [
  {
    id: "prog-1",
    studentId: "student-1",
    subjectId: "sub-1",
    subjectName: "Science",
    materialsCompleted: 1,
    quizzesCompleted: 0,
    averageScore: 0,
    progressPercentage: 60,
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "prog-2",
    studentId: "student-1",
    subjectId: "sub-2",
    subjectName: "Mathematics",
    materialsCompleted: 1,
    quizzesCompleted: 1,
    averageScore: 70,
    progressPercentage: 65,
    updatedAt: "2026-03-02T10:00:00Z",
  },
  {
    id: "prog-3",
    studentId: "student-1",
    subjectId: "sub-3",
    subjectName: "English",
    materialsCompleted: 1,
    quizzesCompleted: 0,
    averageScore: 0,
    progressPercentage: 70,
    updatedAt: "2026-03-03T10:00:00Z",
  },
  {
    id: "prog-4",
    studentId: "student-2",
    subjectId: "sub-1",
    subjectName: "Science",
    materialsCompleted: 1,
    quizzesCompleted: 1,
    averageScore: 90,
    progressPercentage: 90,
    updatedAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "prog-5",
    studentId: "student-3",
    subjectId: "sub-1",
    subjectName: "Science",
    materialsCompleted: 1,
    quizzesCompleted: 1,
    averageScore: 80,
    progressPercentage: 80,
    updatedAt: "2026-03-06T10:00:00Z",
  },
];

// Baseline rewards for demo classmates
export const demoRewards: Reward[] = [
  {
    id: "rew-demo-1",
    studentId: "student-2",
    quizId: "quiz-1",
    quizTitle: "Human Body Quiz",
    subjectId: "sub-1",
    subjectName: "Science",
    percentage: 90,
    badgeName: "Excellent Learner",
    message: "Outstanding performance! You have mastered this topic. Keep up the excellent work! 🌟",
    earnedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "rew-demo-2",
    studentId: "student-3",
    quizId: "quiz-1",
    quizTitle: "Human Body Quiz",
    subjectId: "sub-1",
    subjectName: "Science",
    percentage: 80,
    badgeName: "Great Achievement",
    message: "Excellent work! You are making great progress. 🏆",
    earnedAt: new Date(Date.now() - 120000000).toISOString(),
  },
];

// 75% APPRECIATION REWARD LOGIC:
// 90–100%: "Excellent Learner"
// 80–89%:  "Great Achievement"
// 75–79%:  "Good Effort"
// < 75%:   null (No reward)
export function calculateReward(percentage: number): { badgeName: string; message: string } | null {
  if (percentage >= 90) {
    return {
      badgeName: "Excellent Learner",
      message: "Outstanding performance! You have mastered this topic. Keep up the excellent work! 🌟",
    };
  } else if (percentage >= 80) {
    return {
      badgeName: "Great Achievement",
      message: "Excellent work! You are making great progress.",
    };
  } else if (percentage >= 75) {
    return {
      badgeName: "Good Effort",
      message: "Good effort! You are on the right track. A little more practice will make you even better! 👍",
    };
  }
  return null;
}

export function getRewardMessage(percentage: number): string {
  if (percentage >= 90) {
    return "Outstanding performance! You have mastered this topic. Keep up the excellent work! 🌟";
  }
  if (percentage >= 80) {
    return "Excellent work! You are making great progress.";
  }
  if (percentage >= 75) {
    return "Good effort! You are on the right track. A little more practice will make you even better! 👍";
  }
  return "Keep Practicing! Review the lesson and try again.";
}
