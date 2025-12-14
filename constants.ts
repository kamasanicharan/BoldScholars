import { ContentItem, UpdatePost, UserProfile, UserRole } from './types';

export const MOCK_USER: UserProfile = {
  name: "Alex Scholar",
  email: "alex@example.com",
  phone: "+1 234 567 8900",
  education: "B.Tech Computer Science",
  profession: "Software Intern",
  role: UserRole.USER,
  avatarUrl: "https://picsum.photos/seed/alex/200"
};

export const MOCK_ADMIN: UserProfile = {
  name: "Dr. Sarah Admin",
  email: "admin@boldscholars.com",
  phone: "+1 987 654 3210",
  education: "PhD Computer Science",
  profession: "Professor",
  role: UserRole.ADMIN,
  avatarUrl: "https://picsum.photos/seed/sarah/200"
};

export const INITIAL_UPDATES: UpdatePost[] = [
  {
    id: '1',
    title: "New Data Structures Module Live!",
    content: "We have updated the Knowledge Vault with advanced tree traversal notes.",
    date: "2023-10-25",
    author: "Admin Team"
  },
  {
    id: '2',
    title: "SET Exam Dates Announced",
    content: "Check the Mastery Zone for the newly released schedule for the upcoming SET exams.",
    date: "2023-10-20",
    author: "Admin Team"
  }
];

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    title: "Introduction to Algorithms",
    description: "Fundamental sorting and searching algorithms explained with Python examples.",
    type: 'pdf',
    category: 'Knowledge Vault',
    subCategory: 'Course Materials',
    date: '2023-09-15',
    locked: true
  },
  {
    id: 'c2',
    title: "Operating Systems Notes",
    description: "Deep dive into Process management, memory management, and concurrency.",
    type: 'pdf',
    category: 'Knowledge Vault',
    subCategory: 'Study Guides',
    date: '2023-09-10',
    locked: true
  },
  {
    id: 'c3',
    title: "SET Previous Year Paper (2022)",
    description: "Full solved paper with explanations for logical reasoning section.",
    type: 'pdf',
    category: 'SET/NET',
    subCategory: 'Practice Papers',
    date: '2023-08-05',
    locked: true
  },
  {
    id: 'c4',
    title: "Cracking the NET: A Strategy",
    description: "Time management and topic prioritization for first-time attempters.",
    type: 'article',
    category: 'SET/NET',
    subCategory: 'Tips & Strategy',
    date: '2023-10-01',
    locked: false
  },
  {
    id: 'c5',
    title: "Advanced Database Systems PDF",
    description: "Complete textbook reference for normalization and transaction control.",
    type: 'pdf',
    category: 'Knowledge Vault',
    subCategory: 'E-Books & PDFs',
    date: '2023-10-15',
    locked: true
  }
];