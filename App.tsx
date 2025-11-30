
import React, { useState, useEffect } from 'react';
import { Book, ViewState, NavItem, Category, Partner, Job } from './types';
import { generateDescription } from './services/geminiService';
import { saveFile, getFileUrl } from './services/storage';
import { SectionHeader, BookCard, Button } from './components/Shared';
import { 
  Library, 
  Users, 
  BookOpenText, 
  Info, 
  Handshake, 
  LayoutDashboard, 
  Menu, 
  X, 
  Upload,
  Sparkles,
  Plus,
  Search,
  Lock,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Image as ImageIcon,
  ArrowRight,
  Briefcase,
  FileText,
  Download,
  Calendar,
  Loader2,
  HardDrive,
  CheckCircle2,
  Link as LinkIcon
} from 'lucide-react';

// --- Configuration ---
const LOGO_URL = "logo.png"; // User must ensure this file exists in public/root folder

// --- Mock Data Initialization ---
const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'ثلاثية غرناط',
    author: 'رضوى عاشور',
    category: 'novel',
    description: 'رواية تحمل هم التاريخ والذاكرة، تروي قصة سقوط الأندلس من خلال عائلة موريسكية تعيش مأساة الرحيل والبقاء.',
    coverUrl: 'https://picsum.photos/400/600?random=1',
    dateAdded: Date.now() - 10000000
  },
  {
    id: '2',
    title: 'مبادرة القراءة للجميع',
    author: 'فريق الشباب',
    category: 'initiative',
    description: 'حملة تهدف إلى نشر ثقافة القراءة في الأماكن العامة وتوفير الكتب بأسعار رمزية للطلاب.',
    coverUrl: 'https://picsum.photos/400/600?random=2',
    dateAdded: Date.now() - 5000000
  },
  {
    id: '3',
    title: 'ساق البامبو',
    author: 'سعود السنعوسي',
    category: 'novel',
    description: 'رواية تبحث في إشكاليات الهوية والانتماء من خلال قصة شاب يحمل ملامح فلبينية واسم كويتي.',
    coverUrl: 'https://picsum.photos/400/600?random=3',
    dateAdded: Date.now()
  }
];

const INITIAL_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'وزارة الثقافة',
    description: 'الراعي الرسمي للمبادرات الثقافية والشبابية.',
    logoUrl: 'https://ui-avatars.com/api/?name=وزارة+الثقافة&background=4f46e5&color=fff&size=128'
  },
  {
    id: '2',
    name: 'دار المعرفة',
    description: 'شريك استراتيجي في توفير الكتب والمراجع.',
    logoUrl: 'https://ui-avatars.com/api/?name=دار+المعرفة&background=0d9488&color=fff&size=128'
  },
  {
    id: '3',
    name: 'نادي القراء',
    description: 'مجتمع شبابي يهتم بمناقشة الكتب والروايات.',
    logoUrl: 'https://ui-avatars.com/api/?name=نادي+القراء&background=e11d48&color=fff&size=128'
  }
];

const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'منسق فعاليات ثقافية',
    date: '2023-10-15',
    description: 'نبحث عن شخص مبدع لتنسيق الفعاليات الثقافية الشهرية.',
    pdfUrl: '#',
    pdfName: 'Job_Description_Coordinator.pdf'
  },
  {
    id: '2',
    title: 'مدقق لغوي',
    date: '2023-11-01',
    description: 'مطلوب مدقق لغوي ذو خبرة لمراجعة النصوص المنشورة.',
    pdfUrl: '#',
    pdfName: 'Job_Description_Editor.pdf'
  }
];

// --- Navigation Config ---
const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Library },
  { id: 'initiatives', label: 'المبادرات', icon: Users },
  { id: 'novels', label: 'الروايات', icon: BookOpenText },
  { id: 'jobs', label: 'الوظائف', icon: Briefcase },
  { id: 'partners', label: 'الشركاء', icon: Handshake },
  { id: 'about', label: 'من نحن', icon: Info },
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
];

// --- Intro Animation Component ---
const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<'loading' | 'exiting' | 'hidden'>('loading');

  useEffect(() => {
    // Stage 1: Wait for logo to pulse (2 seconds)
    const timer1 = setTimeout(() => {
      setStage('exiting');
    }, 2200);

    // Stage 2: Wait for doors to open (1 second duration)
    const timer2 = setTimeout(() => {
      setStage('hidden');
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (stage === 'hidden') return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Left Panel */}
      <div 
        className={`absolute top-0 left-0 w-1/2 h-full bg-slate-950 border-r border-slate-800 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform z-20 flex items-center justify-end pr-4 md:pr-10 ${
          stage === 'exiting' ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className={`transition-opacity duration-500 ${stage === 'exiting' ? 'opacity-0' : 'opacity-10'}`}>
          <BookOpenText size={300} className="text-white" />
        </div>
      </div>

      {/* Right Panel */}
      <div 
        className={`absolute top-0 right-0 w-1/2 h-full bg-slate-950 border-l border-slate-800 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform z-20 flex items-center justify-start pl-4 md:pl-10 ${
          stage === 'exiting' ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
         <div className={`transition-opacity duration-500 ${stage === 'exiting' ? 'opacity-0' : 'opacity-10'}`}>
          <BookOpenText size={300} className="text-white" />
        </div>
      </div>

      {/* Center Content (Logo & Text) */}
      <div 
        className={`relative z-30 flex flex-col items-center justify-center transition-all duration-700 ${
          stage === 'exiting' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-20 animate-pulse rounded-full"></div>
          <img 
            src={LOGO_URL} 
            alt="Logo" 
            className="relative z-10 h-32 md:h-48 w-auto object-contain animate-pulse drop-shadow-2xl"
            onError={(e) => {
              // Fallback to text if image fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
            }}
          />
          {/* Fallback Icon (Hidden by default) */}
          <BookOpenText size={100} className="fallback-icon hidden text-primary-500 relative z-10" />
        </div>
        
        <div className="flex items-center gap-3 text-primary-400/80 text-sm font-medium bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-sm mt-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>جاري فتح المكتبة...</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Load data from local storage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('kutuby_books');
    const savedPartners = localStorage.getItem('rufoof_partners');
    const savedJobs = localStorage.getItem('rufoof_jobs');

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      setBooks(INITIAL_BOOKS);
      localStorage.setItem('kutuby_books', JSON.stringify(INITIAL_BOOKS));
    }

    if (savedPartners) {
      setPartners(JSON.parse(savedPartners));
    } else {
      setPartners(INITIAL_PARTNERS);
      localStorage.setItem('rufoof_partners', JSON.stringify(INITIAL_PARTNERS));
    }

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      setJobs(INITIAL_JOBS);
      localStorage.setItem('rufoof_jobs', JSON.stringify(INITIAL_JOBS));
    }
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    
    setIsLoading(false);
  }, []);

  // Handle Dark Mode Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      if (books.length > 0) localStorage.setItem('kutuby_books', JSON.stringify(books));
      if (partners.length > 0) localStorage.setItem('rufoof_partners', JSON.stringify(partners));
      if (jobs.length > 0) localStorage.setItem('rufoof_jobs', JSON.stringify(jobs));
    }
  }, [books, partners, jobs, isLoading]);

  const handleNavClick = (view: ViewState) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    alert('تمت الإضافة بنجاح!');
    setCurrentView(newBook.category === 'novel' ? 'novels' : 'initiatives');
  };

  const handleDownloadFile = async (fileId?: string, fallbackUrl?: string) => {
    if (fileId) {
       const url = await getFileUrl(fileId);
       if (url) {
         window.open(url, '_blank');
         return;
       }
    }
    if (fallbackUrl && fallbackUrl !== '#') {
      window.open(fallbackUrl, '_blank');
    } else {
      alert('لم يتم العثور على الملف المطلوب.');
    }
  };

  // --- Views ---

  const HomeView = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 text-white rounded-3xl overflow-hidden mb-16 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            مرحباً بكم في <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-white">منصة رفوف</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            بوابتك الأولى لاكتشاف الإبداع الأدبي، ودعم المبادرات الشبابية، وإثراء المحتوى العربي في بيئة رقمية ملهمة.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => handleNavClick('novels')} 
              className="group text-lg px-8 py-4 bg-white text-primary-900 hover:bg-primary-50 shadow-xl hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all duration-300 transform font-bold relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                تصفح الروايات
                <ArrowRight className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleNavClick('initiatives')} 
              className="text-lg px-8 py-4 border-2 border-white/30 text-white hover:bg-white hover:text-primary-900 hover:border-white backdrop-blur-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-bold"
            >
              اكتشف المبادرات
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">أحدث الإضافات</h2>
          <button onClick={() => handleNavClick('novels')} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">عرض الكل</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.slice(0, 3).map(book => (
            <div key={book.id} onClick={() => handleDownloadFile(book.pdfFileId, book.pdfUrl)} className="cursor-pointer">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const GridView = ({ category, title, subtitle }: { category: Category; title: string; subtitle: string }) => {
    const filteredBooks = books.filter(b => b.category === category);
    return (
      <div className="animate-fade-in">
        <SectionHeader title={title} subtitle={subtitle} />
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <BookOpenText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">لا توجد محتويات في هذا القسم حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map(book => (
              <div key={book.id} onClick={() => handleDownloadFile(book.pdfFileId, book.pdfUrl)} className="cursor-pointer">
                 <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const JobsView = () => (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <SectionHeader title="الوظائف المتاحة" subtitle="انضم إلى فريق رفوف وشاركنا النجاح" />
      
      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg">لا توجد وظائف متاحة حالياً. يرجى التحقق لاحقاً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium">متاح</span>
                </div>
                {job.description && (
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{job.description}</p>
                )}
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-500">
                  <Calendar size={14} className="ml-1" />
                  <span>تاريخ النشر: {new Date(job.date).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-2">
                 <div className="text-xs text-slate-400 text-center md:text-left mb-1 dir-ltr truncate max-w-[200px]">{job.pdfName}</div>
                 <Button onClick={() => handleDownloadFile(job.pdfFileId, job.pdfUrl)} variant="outline" className="gap-2 w-full md:w-auto">
                    <Download size={16} /> تحميل التفاصيل (PDF)
                 </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const AboutView = () => (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <SectionHeader title="من نحن" subtitle="تعرف على رؤية رفوف ورسالتها" />
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-none overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 h-64 md:h-auto bg-slate-200 dark:bg-slate-700 relative">
          <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-900/10 mix-blend-multiply"></div>
        </div>
        <div className="md:w-1/2 p-8 md:p-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">قصتنا</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            انطلقت "منصة رفوف" بهدف سد الفجوة في المحتوى الرقمي العربي، وتوفير مساحة آمنة ومحفزة للكتاب الشباب لنشر إبداعاتهم، وللقراء للوصول إلى محتوى راقٍ ومتميز.
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">رؤيتنا</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            نسعى لأن نكون المرجع الأول للمحتوى الأدبي والمبادرات الثقافية في العالم العربي، من خلال تسخير التكنولوجيا لخدمة الثقافة.
          </p>
        </div>
      </div>
    </div>
  );

  const PartnersView = () => (
    <div className="animate-fade-in">
       <SectionHeader title="شركاء النجاح" subtitle="نعتز بالعمل مع نخبة من المؤسسات" />
       
       {partners.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Handshake className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>لا يوجد شركاء مضافين حالياً.</p>
          </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-32 h-32 mb-6 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-slate-50 dark:border-slate-600 shadow-inner">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-primary-200">?</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{partner.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{partner.description}</p>
              </div>
            ))}
         </div>
       )}
    </div>
  );

  const DashboardView = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');
    const [activeTab, setActiveTab] = useState<'content' | 'partners' | 'jobs'>('content');

    // --- Books Form State ---
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState<Category>('novel');
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [fileName, setFileName] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [externalUrl, setExternalUrl] = useState('');
    const [coverName, setCoverName] = useState('');

    // --- Partners Form State ---
    const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
    const [partnerName, setPartnerName] = useState('');
    const [partnerDesc, setPartnerDesc] = useState('');
    const [partnerLogoName, setPartnerLogoName] = useState('');
    const [partnerFile, setPartnerFile] = useState<File | null>(null);

    // --- Jobs Form State ---
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [jobDate, setJobDate] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobPdfName, setJobPdfName] = useState('');
    const [jobFile, setJobFile] = useState<File | null>(null);

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput === 'admin123') {
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('كلمة المرور غير صحيحة');
      }
    };

    // --- Book Functions ---
    const handleGenerate = async () => {
      if (!title) {
        alert('الرجاء كتابة العنوان أولاً');
        return;
      }
      setIsGenerating(true);
      const desc = await generateDescription(title, author, category as 'novel' | 'initiative');
      setDescription(desc);
      setIsGenerating(false);
    };

    const resetForm = () => {
      setTitle('');
      setAuthor('');
      setCategory('novel');
      setDescription('');
      setFileName('');
      setPdfFile(null);
      setExternalUrl('');
      setCoverName('');
      setEditingId(null);
    };

    const startEdit = (book: Book) => {
      setTitle(book.title);
      setAuthor(book.author);
      setCategory(book.category);
      setDescription(book.description);
      setExternalUrl(book.pdfUrl && book.pdfUrl !== '#' ? book.pdfUrl : '');
      setEditingId(book.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteBook = (id: string) => {
      if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المحتوى؟ لا يمكن التراجع عن هذا الإجراء.')) {
        setBooks(prev => prev.filter(b => b.id !== id));
        if (editingId === id) resetForm();
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      let pdfFileId = undefined;
      if (pdfFile) {
        try {
          pdfFileId = await saveFile(pdfFile);
        } catch (err) {
          console.error("Storage failed", err);
          alert("حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.");
          return;
        }
      }

      const finalTitle = title.trim() || 'بدون عنوان';
      const finalAuthor = author.trim() || 'غير محدد';
      const finalPdfUrl = externalUrl.trim() || '#';

      if (editingId) {
        // Update existing
        setBooks(prev => prev.map(book => {
          if (book.id === editingId) {
            return {
              ...book,
              title: finalTitle,
              author: finalAuthor,
              category,
              description,
              coverUrl: coverName ? `https://picsum.photos/400/600?random=${Date.now()}` : book.coverUrl,
              pdfFileId: pdfFileId || book.pdfFileId,
              pdfUrl: finalPdfUrl !== '#' ? finalPdfUrl : book.pdfUrl,
              pdfName: fileName || book.pdfName
            };
          }
          return book;
        }));
        alert('تم حفظ التعديلات بنجاح');
        resetForm();
      } else {
        // Create new
        const newBook: Book = {
          id: Date.now().toString(),
          title: finalTitle,
          author: finalAuthor,
          category,
          description,
          coverUrl: `https://picsum.photos/400/600?random=${Date.now()}`,
          pdfUrl: finalPdfUrl,
          pdfFileId,
          pdfName: fileName,
          dateAdded: Date.now()
        };
        handleAddBook(newBook);
        resetForm();
      }
    };

    // --- Partner Functions ---
    const resetPartnerForm = () => {
      setPartnerName('');
      setPartnerDesc('');
      setPartnerLogoName('');
      setPartnerFile(null);
      setEditingPartnerId(null);
    };

    const startEditPartner = (partner: Partner) => {
      setPartnerName(partner.name);
      setPartnerDesc(partner.description);
      setEditingPartnerId(partner.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deletePartner = (id: string) => {
      if (window.confirm('هل أنت متأكد من حذف هذا الشريك؟')) {
        setPartners(prev => prev.filter(p => p.id !== id));
        if (editingPartnerId === id) resetPartnerForm();
      }
    };

    const handleSubmitPartner = async (e: React.FormEvent) => {
      e.preventDefault();
      
      let logoFileId = undefined;
      let logoUrl = editingPartnerId ? (partners.find(p => p.id === editingPartnerId)?.logoUrl || '') : `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName || 'P')}&background=random`;

      if (partnerFile) {
        try {
          logoFileId = await saveFile(partnerFile);
          logoUrl = (await getFileUrl(logoFileId)) || logoUrl;
        } catch (err) {
          console.error("Logo upload failed", err);
          return;
        }
      }

      const finalName = partnerName.trim() || 'بدون اسم';

      if (editingPartnerId) {
        setPartners(prev => prev.map(p => 
          p.id === editingPartnerId ? { ...p, name: finalName, description: partnerDesc, logoUrl, logoFileId: logoFileId || p.logoFileId } : p
        ));
        resetPartnerForm();
      } else {
        const newPartner: Partner = {
          id: Date.now().toString(),
          name: finalName,
          description: partnerDesc,
          logoUrl,
          logoFileId
        };
        setPartners(prev => [...prev, newPartner]);
        resetPartnerForm();
      }
    };

    // --- Job Functions ---
    const resetJobForm = () => {
      setJobTitle('');
      setJobDate('');
      setJobDesc('');
      setJobPdfName('');
      setJobFile(null);
      setEditingJobId(null);
    };

    const startEditJob = (job: Job) => {
      setJobTitle(job.title);
      setJobDate(job.date);
      setJobDesc(job.description || '');
      setEditingJobId(job.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteJob = (id: string) => {
      if (window.confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) {
        setJobs(prev => prev.filter(j => j.id !== id));
        if (editingJobId === id) resetJobForm();
      }
    };

    const handleSubmitJob = async (e: React.FormEvent) => {
      e.preventDefault();
      
      let pdfFileId = undefined;
      if (jobFile) {
        try {
          pdfFileId = await saveFile(jobFile);
        } catch (err) {
          console.error("Job PDF upload failed", err);
          return;
        }
      }

      const finalTitle = jobTitle.trim() || 'وظيفة شاغرة';
      const finalDate = jobDate || new Date().toISOString().split('T')[0];

      if (editingJobId) {
        setJobs(prev => prev.map(j => 
          j.id === editingJobId ? { 
            ...j, 
            title: finalTitle, 
            date: finalDate, 
            description: jobDesc, 
            pdfFileId: pdfFileId || j.pdfFileId, 
            pdfName: jobPdfName || j.pdfName 
          } : j
        ));
        resetJobForm();
      } else {
        const newJob: Job = {
          id: Date.now().toString(),
          title: finalTitle,
          date: finalDate, 
          description: jobDesc,
          pdfUrl: '#',
          pdfFileId,
          pdfName: jobPdfName
        };
        setJobs(prev => [...prev, newJob]);
        resetJobForm();
      }
    };

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">لوحة التحكم</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">يرجى تسجيل الدخول للمتابعة</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="أدخل كلمة المرور..."
                />
              </div>
              {authError && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <X size={14} /> {authError}
                </p>
              )}
              <Button onClick={() => {}} className="w-full justify-center text-lg">
                دخول
              </Button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fade-in max-w-6xl mx-auto">
        <SectionHeader title="لوحة التحكم" subtitle="إدارة المحتوى والموقع" />

        {/* Storage Widget */}
        <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <HardDrive size={24} className="text-primary-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">حالة التخزين (IndexedDB)</h3>
                <p className="text-slate-300 text-sm">مساحة تخزين الملفات والمرفقات</p>
              </div>
           </div>
           <div className="text-left">
              <div className="text-2xl font-bold text-primary-300">200MB</div>
              <div className="text-xs text-slate-400">الحد الأقصى المتاح</div>
           </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'content' 
                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            إدارة الكتب والمبادرات
          </button>
          <button 
            onClick={() => setActiveTab('partners')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'partners' 
                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            إدارة الشركاء
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'jobs' 
                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            إدارة الوظائف
          </button>
        </div>

        {/* --- Content Management Tab --- */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-fade-in">
            {/* Add/Edit Form */}
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6 text-primary-700 dark:text-primary-400 border-b border-slate-100 dark:border-slate-700 pb-4">
                {editingId ? <Edit size={24} /> : <Plus size={24} />}
                <h3 className="text-xl font-bold">{editingId ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">عنوان العمل</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="اسم الرواية أو المبادرة (اختياري)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المؤلف / المنظم</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="اسم الكاتب أو الجهة المنظمة (اختياري)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">التصنيف</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="novel">رواية</option>
                      <option value="initiative">مبادرة شبابية</option>
                    </select>
                  </div>
                  
                  {/* File Upload OR External Link */}
                  <div className="space-y-3">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رفع ملف (PDF)</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setFileName(e.target.files[0].name);
                                setPdfFile(e.target.files[0]);
                                setExternalUrl(''); // Clear URL if file selected
                              }
                            }}
                            className="hidden"
                            id="pdf-upload"
                          />
                          <label 
                            htmlFor="pdf-upload" 
                            className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                          >
                            <span className="text-slate-500 dark:text-slate-400 truncate">
                              {fileName || 'اختر ملف PDF من الجهاز...'}
                            </span>
                            <Upload size={18} />
                          </label>
                        </div>
                     </div>
                     
                     <div className="relative flex items-center gap-2">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                        <span className="text-xs text-slate-400 font-medium">أو</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رابط خارجي (Drive/Dropbox)</label>
                        <div className="relative">
                           <input 
                              type="url"
                              value={externalUrl}
                              onChange={(e) => {
                                setExternalUrl(e.target.value);
                                if(e.target.value) {
                                   setFileName('');
                                   setPdfFile(null);
                                }
                              }}
                              placeholder="https://drive.google.com/..."
                              className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                           />
                           <LinkIcon size={18} className="absolute left-3 top-2.5 text-slate-400" />
                        </div>
                     </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">الوصف</label>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating || !title}
                      className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-700 disabled:opacity-50 font-medium"
                    >
                      <Sparkles size={12} /> توليد بالذكاء الاصطناعي
                    </button>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    placeholder="اكتب وصفاً مختصراً (اختياري)..."
                  />
                  {isGenerating && <p className="text-xs text-primary-500 mt-1 animate-pulse">جاري توليد الوصف...</p>}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={() => {}} className="flex-1 gap-2">
                    {editingId ? <><Save size={18} /> حفظ التعديلات</> : <><Plus size={18} /> نشر المحتوى</>}
                  </Button>
                  {editingId && (
                     <Button variant="outline" onClick={resetForm} className="gap-2">
                       <X size={18} /> إلغاء
                     </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Content Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-700 dark:text-slate-200">قائمة المحتوى ({books.length})</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-right">
                   <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                     <tr>
                       <th className="px-6 py-3 font-medium">العنوان</th>
                       <th className="px-6 py-3 font-medium">المؤلف</th>
                       <th className="px-6 py-3 font-medium">التصنيف</th>
                       <th className="px-6 py-3 font-medium text-center">الإجراءات</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                     {books.map((book) => (
                       <tr key={book.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${editingId === book.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}>
                         <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{book.title}</td>
                         <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{book.author}</td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${book.category === 'novel' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'}`}>
                             {book.category === 'novel' ? 'رواية' : 'مبادرة'}
                           </span>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2">
                             <button 
                               onClick={() => startEdit(book)}
                               className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
                               title="تعديل"
                             >
                               <Edit size={16} />
                             </button>
                             <button 
                               onClick={() => deleteBook(book.id)}
                               className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors dark:text-red-400 dark:hover:bg-red-900/30"
                               title="حذف"
                             >
                               <Trash2 size={16} />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 {books.length === 0 && (
                   <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                     لا يوجد محتوى مضاف حتى الآن.
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {/* --- Partners Management Tab --- */}
        {activeTab === 'partners' && (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-6 text-primary-700 dark:text-primary-400 border-b border-slate-100 dark:border-slate-700 pb-4">
                  {editingPartnerId ? <Edit size={24} /> : <Plus size={24} />}
                  <h3 className="text-xl font-bold">{editingPartnerId ? 'تعديل بيانات شريك' : 'إضافة شريك جديد'}</h3>
                </div>
                <form onSubmit={handleSubmitPartner} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">اسم الشريك</label>
                        <input
                          type="text"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="اسم الشريك (اختياري)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">شعار الشريك (صورة)</label>
                        <div className="relative">
                           <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setPartnerLogoName(e.target.files[0].name);
                                setPartnerFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            id="partner-logo-upload"
                           />
                           <label htmlFor="partner-logo-upload" className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                              <span className="text-slate-500 dark:text-slate-400 truncate">{partnerLogoName || 'اختر صورة الشعار...'}</span>
                              <ImageIcon size={18} className="text-slate-400" />
                           </label>
                        </div>
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">معلومات عن الشريك</label>
                      <textarea
                        value={partnerDesc}
                        onChange={(e) => setPartnerDesc(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="معلومات مختصرة (اختياري)..."
                      />
                   </div>
                   <div className="flex gap-4">
                      <Button onClick={() => {}} className="flex-1">
                        {editingPartnerId ? 'حفظ التغييرات' : 'إضافة الشريك'}
                      </Button>
                      {editingPartnerId && (
                        <Button variant="outline" onClick={resetPartnerForm}>إلغاء</Button>
                      )}
                   </div>
                </form>
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">قائمة الشركاء ({partners.length})</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-right">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-6 py-3 font-medium">الاسم</th>
                          <th className="px-6 py-3 font-medium">الوصف</th>
                          <th className="px-6 py-3 font-medium text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {partners.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                             <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.name}</td>
                             <td className="px-6 py-4 text-slate-600 dark:text-slate-400 truncate max-w-xs">{p.description}</td>
                             <td className="px-6 py-4 flex justify-center gap-2">
                                <button onClick={() => startEditPartner(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/30"><Edit size={16} /></button>
                                <button onClick={() => deletePartner(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/30"><Trash2 size={16} /></button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* --- Jobs Management Tab --- */}
        {activeTab === 'jobs' && (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-6 text-primary-700 dark:text-primary-400 border-b border-slate-100 dark:border-slate-700 pb-4">
                  {editingJobId ? <Edit size={24} /> : <Plus size={24} />}
                  <h3 className="text-xl font-bold">{editingJobId ? 'تعديل وظيفة' : 'إضافة وظيفة جديدة'}</h3>
                </div>
                <form onSubmit={handleSubmitJob} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المسمى الوظيفي</label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="المسمى الوظيفي (اختياري)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">تاريخ النشر</label>
                        <input
                          type="date"
                          value={jobDate}
                          onChange={(e) => setJobDate(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">تفاصيل الوظيفة (PDF)</label>
                         <div className="relative">
                           <input
                             type="file"
                             accept=".pdf"
                             onChange={(e) => {
                               if (e.target.files?.[0]) {
                                 setJobPdfName(e.target.files[0].name);
                                 setJobFile(e.target.files[0]);
                               }
                             }}
                             className="hidden"
                             id="job-pdf-upload"
                           />
                           <label htmlFor="job-pdf-upload" className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                              <span className="text-slate-500 dark:text-slate-400 truncate">{jobPdfName || 'اختر ملف PDF...'}</span>
                              <Upload size={18} className="text-slate-400" />
                           </label>
                         </div>
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">وصف مختصر</label>
                      <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="وصف الوظيفة (اختياري)..."
                      />
                   </div>
                   <div className="flex gap-4">
                      <Button onClick={() => {}} className="flex-1">
                        {editingJobId ? 'حفظ التغييرات' : 'نشر الوظيفة'}
                      </Button>
                      {editingJobId && (
                        <Button variant="outline" onClick={resetJobForm}>إلغاء</Button>
                      )}
                   </div>
                </form>
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">قائمة الوظائف ({jobs.length})</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-right">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-6 py-3 font-medium">المسمى</th>
                          <th className="px-6 py-3 font-medium">التاريخ</th>
                          <th className="px-6 py-3 font-medium text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {jobs.map(j => (
                          <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                             <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{j.title}</td>
                             <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{j.date}</td>
                             <td className="px-6 py-4 flex justify-center gap-2">
                                <button onClick={() => startEditJob(j)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/30"><Edit size={16} /></button>
                                <button onClick={() => deleteJob(j.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/30"><Trash2 size={16} /></button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 ${isMobileMenuOpen ? 'overflow-hidden' : ''}`}>
      {/* Intro Animation */}
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
             <img 
               src={LOGO_URL} 
               alt="RUFOOF" 
               className="h-14 w-auto object-contain"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
               }}
             />
             <div className="fallback-logo hidden flex items-center gap-2">
                <div className="bg-primary-600 text-white p-2 rounded-lg">
                  <Library size={28} />
                </div>
                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-primary-700 to-primary-500 dark:from-primary-300 dark:to-primary-500">
                  رفوف
                </span>
             </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentView === item.id 
                    ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={toggleDarkMode}
               className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
               title="تبديل الوضع الليلي"
             >
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             {/* Mobile Menu Button */}
             <button 
               className="md:hidden p-2 text-slate-700 dark:text-slate-200"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-4 p-4 rounded-xl text-lg font-bold transition-colors ${
                  currentView === item.id 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                    : 'text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800'
                }`}
              >
                <item.icon size={24} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {currentView === 'home' && <HomeView />}
        {currentView === 'novels' && <GridView category="novel" title="الروايات" subtitle="مجموعة مميزة من الروايات العربية والعالمية" />}
        {currentView === 'initiatives' && <GridView category="initiative" title="المبادرات الشبابية" subtitle="أفكار ومشاريع تصنع التغيير" />}
        {currentView === 'jobs' && <JobsView />}
        {currentView === 'partners' && <PartnersView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'dashboard' && <DashboardView />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-12 mt-12 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img 
                   src={LOGO_URL} 
                   alt="RUFOOF" 
                   className="h-16 w-auto object-contain"
                   onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     e.currentTarget.parentElement?.querySelector('.fallback-footer-logo')?.classList.remove('hidden');
                   }}
                 />
                 <div className="fallback-footer-logo hidden flex items-center gap-2 text-primary-600 dark:text-primary-400">
                    <Library size={32} />
                    <span className="text-2xl font-bold">رفوف</span>
                 </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                منصة ثقافية متكاملة تهدف إلى تعزيز المحتوى العربي الرقمي ودعم المبدعين الشباب في شتى المجالات.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">روابط سريعة</h4>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                <li><button onClick={() => handleNavClick('home')} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">الرئيسية</button></li>
                <li><button onClick={() => handleNavClick('novels')} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">الروايات</button></li>
                <li><button onClick={() => handleNavClick('initiatives')} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">المبادرات</button></li>
                <li><button onClick={() => handleNavClick('about')} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">من نحن</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">الدعم والمساعدة</h4>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                <li><button className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">سياسة الخصوصية</button></li>
                <li><button className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">شروط الاستخدام</button></li>
                <li><button className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">الأسئلة الشائعة</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">فريق العمل</h4>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                   <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                   <div>
                      <span className="block font-medium text-slate-800 dark:text-slate-200">إعداد منسقة الوصول</span>
                      <span className="text-sm">الآنسة سيدرة الملا علي</span>
                   </div>
                </li>
                <li className="flex items-start gap-2">
                   <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                   <div>
                      <span className="block font-medium text-slate-800 dark:text-slate-200">تنفيذ</span>
                      <span className="text-sm">أ. نبيل الحميد</span>
                   </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-500 text-sm">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} منصة رفوف</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
