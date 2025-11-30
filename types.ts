
export type Category = 'novel' | 'initiative' | 'general';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  description: string;
  coverUrl: string;
  coverFileId?: string; // Reference to IndexedDB
  pdfUrl?: string; // Legacy/External URL
  pdfFileId?: string; // Reference to IndexedDB
  pdfName?: string; // For display
  dateAdded: number;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  logoFileId?: string; // Reference to IndexedDB
}

export interface Job {
  id: string;
  title: string;
  date: string;
  description?: string; 
  pdfUrl: string;     
  pdfFileId?: string; // Reference to IndexedDB
  pdfName: string;    
}

export type ViewState = 'home' | 'initiatives' | 'novels' | 'about' | 'partners' | 'jobs' | 'dashboard';

export interface NavItem {
  id: ViewState;
  label: string;
  icon?: any;
}
