import React from 'react';
import { Book as BookType } from '../types';
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react';

export const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-10 text-center">
    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{title}</h2>
    {subtitle && <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{subtitle}</p>}
    <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-4 rounded-full"></div>
  </div>
);

export const BookCard = ({ book }: { book: BookType } & React.Attributes) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl dark:shadow-none hover:dark:bg-slate-750 transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden group flex flex-col h-full">
    <div className="relative h-64 overflow-hidden bg-slate-200 dark:bg-slate-700">
      <img 
        src={book.coverUrl} 
        alt={book.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <span className="text-white text-sm font-medium">اقرأ المزيد</span>
      </div>
      <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-700 dark:text-primary-400 shadow-sm">
        {book.category === 'novel' ? 'رواية' : 'مبادرة'}
      </div>
    </div>
    
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{book.title}</h3>
      <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-3">
        <User size={14} className="ml-1" />
        <span>{book.author}</span>
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
        {book.description}
      </p>
      
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center">
          <Calendar size={12} className="ml-1" />
          {new Date(book.dateAdded).toLocaleDateString('ar-EG')}
        </span>
        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-semibold flex items-center group-hover:gap-2 transition-all">
          التفاصيل <ArrowRight size={16} className="mr-1" />
        </button>
      </div>
    </div>
  </div>
);

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  isLoading = false, 
  className = '' 
}: { 
  children?: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline'; 
  isLoading?: boolean;
  className?: string;
}) => {
  const baseStyle = "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg shadow-primary-500/30 dark:shadow-none",
    secondary: "bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-slate-800"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin ml-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          جاري المعالجة...
        </>
      ) : children}
    </button>
  );
};