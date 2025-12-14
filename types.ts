export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  profession: string;
  role: UserRole;
  avatarUrl?: string;
}

export type VaultSubCategory = 'Course Materials' | 'Study Guides' | 'E-Books & PDFs' | 'FAQs';
export type MasterySubCategory = 'Course Materials' | 'Exam Overview' | 'Practice Papers' | 'Tips & Strategy';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  fileUrl?: string; // URL from Firebase Storage
  type: 'pdf' | 'video' | 'article';
  category: 'Knowledge Vault' | 'SET/NET';
  subCategory: VaultSubCategory | MasterySubCategory;
  date: string;
  locked: boolean;
}

export interface UpdatePost {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Feedback {
  id: string;
  user: string;
  message: string;
  date: string;
}

export type ViewState = 'home' | 'vault' | 'mastery' | 'connect' | 'dashboard' | 'admin' | 'login';