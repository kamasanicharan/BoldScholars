import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap, 
  ScrollText, 
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  FileText,
  Lightbulb,
  Search,
  ArrowRight,
  UploadCloud,
  Lock,
  Loader2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, UserProfile, ViewState, ContentItem, UpdatePost, Feedback, VaultSubCategory, MasterySubCategory } from './types';
import { DocumentViewer } from './components/DocumentViewer';

// Firebase Imports
import { auth, googleProvider, db, storage } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Shared Components ---

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white p-2 rounded-xl shadow-lg shadow-brand-500/30">
      <GraduationCap className="w-6 h-6" />
    </div>
    <div className="flex flex-col">
      <span className="font-display font-bold text-xl leading-none text-gray-900 tracking-tight">BOLD</span>
      <span className="font-sans text-xs font-semibold text-brand-600 tracking-widest uppercase">Scholars</span>
    </div>
  </div>
);

const AnimatedTab = ({ 
  tabs, 
  activeTab, 
  setActiveTab 
}: { 
  tabs: string[], 
  activeTab: string, 
  setActiveTab: (t: any) => void 
}) => (
  <div className="flex flex-wrap gap-2 p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl mb-8 w-fit">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`
          relative px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${activeTab === tab ? 'text-brand-700' : 'text-gray-500 hover:text-gray-700'}
        `}
      >
        {activeTab === tab && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-white shadow-sm rounded-lg border border-gray-200/50"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10">{tab}</span>
      </button>
    ))}
  </div>
);

const SectionHero = ({ title, subtitle, icon: Icon, pattern = "circles" }: any) => (
  <div className="relative overflow-hidden bg-brand-900 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-2xl shadow-brand-900/20">
    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display font-bold mb-3"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-brand-100 text-lg max-w-2xl"
        >
          {subtitle}
        </motion.p>
      </div>
      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
        <Icon className="w-10 h-10 text-brand-200" />
      </div>
    </div>
    
    {/* Decorative Background Elements */}
    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
  </div>
);

// --- Page Components ---

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl shadow-brand-900/10 border border-gray-100 text-center">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Sign in with your Google account to access the Knowledge Vault.</p>
        
        <button 
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-all group"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
          <span className="font-bold text-gray-700 group-hover:text-brand-700">Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

const Hero = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => (
  <div className="relative pt-20 pb-32 px-4 overflow-hidden">
    <div className="absolute inset-0 bg-brand-50/50 -z-10"></div>
    
    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-200/30 rounded-full blur-3xl animate-blob"></div>
    <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

    <div className="max-w-6xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-2 rounded-full bg-white border border-brand-100 text-brand-700 text-sm font-bold tracking-wide mb-6 shadow-sm">
          🚀 Empowering Future Tech Leaders
        </span>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gray-900 tracking-tight">
          From Basics to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Breakthroughs</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
          Unlock the comprehensive Knowledge Vault and master the SET/NET exams with curated resources designed for your success.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => onNavigate('vault')}
            className="group relative bg-brand-600 text-white px-8 py-4 rounded-full font-semibold overflow-hidden shadow-xl shadow-brand-500/20 transition-transform hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">Explore Knowledge Vault <ArrowRight className="w-4 h-4" /></span>
            <div className="absolute inset-0 bg-brand-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>
          <button 
            onClick={() => onNavigate('mastery')}
            className="px-8 py-4 rounded-full font-semibold text-brand-700 bg-white border border-brand-100 shadow-lg shadow-gray-200/50 hover:bg-brand-50 transition-colors"
          >
            Visit SET/NET Zone
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);

// --- Main App ---

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<ContentItem | null>(null);

  // Live Data State
  const [updates, setUpdates] = useState<UpdatePost[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // View Specific States
  const [vaultTab, setVaultTab] = useState<VaultSubCategory>('Course Materials');
  const [masteryTab, setMasteryTab] = useState<MasterySubCategory>('Course Materials');

  // --- 1. Authentication & User Logic ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if user profile exists in Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        // Define Super Admin Email
        const SUPER_ADMIN = "boldscholars@gmail.com";
        let role = UserRole.USER;
        
        // Logic: You are admin if you are the Super Admin OR if you were previously assigned admin role in DB
        if (currentUser.email === SUPER_ADMIN) {
          role = UserRole.ADMIN;
        } else if (userSnap.exists() && userSnap.data().role === UserRole.ADMIN) {
           role = UserRole.ADMIN;
        }

        const userData: UserProfile = {
          uid: currentUser.uid,
          name: currentUser.displayName || "Scholar",
          email: currentUser.email || "",
          avatarUrl: currentUser.photoURL || "",
          role: role,
          phone: userSnap.exists() ? userSnap.data().phone : "",
          education: userSnap.exists() ? userSnap.data().education : "",
          profession: userSnap.exists() ? userSnap.data().profession : "",
        };

        // Save/Update user in Firestore
        await setDoc(userRef, { ...userData }, { merge: true });
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setView('dashboard');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setView('home');
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      phone: updatedUser.phone,
      education: updatedUser.education,
      profession: updatedUser.profession
    }, { merge: true });
    setUser(updatedUser);
    alert("Profile updated successfully!");
  };

  // --- 2. Real-time Data Listeners ---
  useEffect(() => {
    // Listen to Content
    const qContent = query(collection(db, "content"), orderBy("date", "desc"));
    const unsubContent = onSnapshot(qContent, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem));
      setContent(items);
    });

    // Listen to Updates
    const qUpdates = query(collection(db, "updates"), orderBy("date", "desc"));
    const unsubUpdates = onSnapshot(qUpdates, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UpdatePost));
      setUpdates(items);
    });

    // Listen to Feedbacks (Only if admin, strictly speaking, but for simplicity we load it)
    const qFeedback = query(collection(db, "feedbacks"), orderBy("date", "desc"));
    const unsubFeedback = onSnapshot(qFeedback, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
      setFeedbacks(items);
    });

    return () => {
      unsubContent();
      unsubUpdates();
      unsubFeedback();
    };
  }, []);

  // --- 3. Admin Actions (Writes to Firebase) ---
  const handleAddUpdate = async (update: UpdatePost) => {
    await addDoc(collection(db, "updates"), update);
  };

  const handleAddContent = async (item: ContentItem) => {
    await addDoc(collection(db, "content"), item);
  };

  const handleAddFeedback = async (feedback: Feedback) => {
    await addDoc(collection(db, "feedbacks"), feedback);
  };

  const handleDeleteContent = async (id: string) => {
    if(confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, "content", id));
    }
  }

  const handleViewContent = (item: ContentItem) => {
    if (item.locked && !user) {
      if(confirm("This content is exclusive to Bold Scholars members. Please login with Google.")) {
        setView('login');
      }
      return;
    }
    setActiveDocument(item);
  };

  const filteredVaultContent = content.filter(c => c.category === 'Knowledge Vault' && c.subCategory === vaultTab);
  const filteredMasteryContent = content.filter(c => c.category === 'SET/NET' && c.subCategory === masteryTab);

  const NavLink = ({ target, label, icon: Icon }: any) => (
    <button
      onClick={() => { setView(target); setIsMenuOpen(false); }}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
        view === target ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {Icon && <Icon className={`w-4 h-4 ${view === target ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-600'}`} />}
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="cursor-pointer" onClick={() => setView('home')}>
              <Logo />
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink target="home" label="Home" />
              <NavLink target="vault" label="Knowledge Vault" icon={BookOpen} />
              <NavLink target="mastery" label="Mastery Zone" icon={ShieldCheck} />
              <NavLink target="connect" label="Connect" icon={MessageSquare} />
              
              <div className="w-px h-6 bg-gray-200 mx-4"></div>

              {user ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setView(user.role === UserRole.ADMIN ? 'admin' : 'dashboard')}
                    className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all group"
                  >
                    <img src={user.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-700">{user.name}</span>
                  </button>
                  <button onClick={handleLogout} title="Logout" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setView('login')} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <NavLink target="home" label="Home" />
                <NavLink target="vault" label="Knowledge Vault" />
                <NavLink target="mastery" label="Mastery Zone" />
                <NavLink target="connect" label="Connect" />
                {user ? (
                  <>
                    <NavLink target={user.role === UserRole.ADMIN ? 'admin' : 'dashboard'} label="Dashboard" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 font-medium">Logout</button>
                  </>
                ) : (
                  <button onClick={() => { setView('login'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-brand-600 font-bold">Login</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-20">
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <>
            <Hero onNavigate={setView} />
            
            <section className="py-20 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-3 bg-accent-100 rounded-xl text-accent-600">
                    <ScrollText className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-gray-900">Latest Updates</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {updates.length === 0 && <p className="text-gray-500">No updates yet.</p>}
                  {updates.map((update, idx) => (
                    <motion.div 
                      key={update.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group p-6 rounded-2xl border border-gray-100 bg-brand-50/50 hover:bg-brand-50 hover:border-brand-200 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold tracking-wider text-brand-600 uppercase bg-white px-3 py-1 rounded-full shadow-sm">{update.date}</span>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transform group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-brand-700 transition-colors">{update.title}</h3>
                      <p className="text-gray-600">{update.content}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && <LoginPage onLogin={handleGoogleLogin} />}

        {/* --- KNOWLEDGE VAULT VIEW --- */}
        {view === 'vault' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <SectionHero 
              title="Knowledge Vault" 
              subtitle="Access our comprehensive library of course materials, study guides, and reference books."
              icon={BookOpen}
            />
            
            <AnimatedTab 
              tabs={['Course Materials', 'Study Guides', 'E-Books & PDFs', 'FAQs']} 
              activeTab={vaultTab} 
              setActiveTab={setVaultTab} 
            />

            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredVaultContent.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-brand-50 rounded-lg text-brand-600 group-hover:scale-110 transition-transform">
                        {item.type === 'pdf' ? <FileText className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                      </div>
                      <div className="flex gap-2">
                        {item.locked && (
                          <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full" title="Login Required">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                        {user?.role === UserRole.ADMIN && (
                          <button onClick={() => handleDeleteContent(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[2.5rem]">{item.description}</p>
                    <button 
                      onClick={() => handleViewContent(item)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-200 text-brand-700 font-semibold hover:bg-brand-600 hover:text-white hover:border-transparent transition-all"
                    >
                      {item.locked && !user ? 'Login to View' : 'Read Material'}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredVaultContent.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-bold mb-1">No content found</h3>
                <p className="text-gray-500">Check back later for updates in this category.</p>
              </div>
            )}
          </div>
        )}

        {/* --- MASTERY ZONE VIEW --- */}
        {view === 'mastery' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <SectionHero 
              title="SET/NET Mastery Zone" 
              subtitle="Targeted preparation strategies, mock tests, and syllabus breakdowns."
              icon={ShieldCheck}
            />

            <AnimatedTab 
              tabs={['Course Materials', 'Exam Overview', 'Practice Papers', 'Tips & Strategy']} 
              activeTab={masteryTab} 
              setActiveTab={setMasteryTab} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-4">
                {filteredMasteryContent.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-brand-300 transition-colors relative"
                  >
                    <div className="bg-brand-50 p-4 rounded-full text-brand-600 shrink-0">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-bold text-lg text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                    </div>
                     {user?.role === UserRole.ADMIN && (
                        <button onClick={() => handleDeleteContent(item.id)} className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-50 rounded-full">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    <button 
                      onClick={() => handleViewContent(item)}
                      className="shrink-0 px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
                    >
                      Access Content
                    </button>
                  </motion.div>
                ))}
                {filteredMasteryContent.length === 0 && (
                   <div className="text-center py-12 text-gray-500">No content available for {masteryTab} yet.</div>
                )}
              </div>

              {/* Sidebar for Mastery */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                  <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" /> Quick Tips
                  </h3>
                  <ul className="space-y-4 text-sm text-amber-800">
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Review previous year papers at least twice.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Focus on Paper 1 (Teaching Aptitude) for easy scoring.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CONNECT VIEW --- */}
        {view === 'connect' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
              <div className="p-12 flex flex-col justify-center bg-gray-50">
                <span className="text-brand-600 font-bold tracking-wider text-sm uppercase mb-4">Get in Touch</span>
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">We'd love to hear from you.</h2>
                <p className="text-gray-600 mb-8 text-lg">Have a suggestion for the Knowledge Vault? Found a bug? Or just want to say hi?</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="font-medium">support@boldscholars.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Join our Discord Community</span>
                  </div>
                </div>
              </div>

              <div className="p-12">
                <form className="space-y-6" onSubmit={(e) => {
                   e.preventDefault();
                   const form = e.target as HTMLFormElement;
                   const msg = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                   handleAddFeedback({
                     id: Date.now().toString(),
                     user: user ? user.name : 'Guest',
                     message: msg,
                     date: new Date().toISOString().split('T')[0]
                   });
                   form.reset();
                   alert("Thanks! Your feedback helps us grow.");
                 }}>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Your Name</label>
                    <input type="text" disabled={!!user} defaultValue={user?.name || ''} placeholder="Guest" className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
                    <textarea name="message" required className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all h-40 resize-none" placeholder="Tell us what's on your mind..."></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transform hover:-translate-y-1 transition-all shadow-lg shadow-brand-500/30">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- USER DASHBOARD --- */}
        {view === 'dashboard' && user && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Student Dashboard</h2>
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
               <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-700 relative">
                 <div className="absolute -bottom-12 left-8">
                   <div className="relative">
                      <img src={user.avatarUrl} className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-white" alt="Profile" />
                      <button className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-2 rounded-full hover:bg-brand-600 transition-colors">
                        <Users className="w-4 h-4" />
                      </button>
                   </div>
                 </div>
               </div>
               <div className="pt-16 pb-8 px-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active Scholar</span>
                  </div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                    const education = (form.elements.namedItem('education') as HTMLInputElement).value;
                    const profession = (form.elements.namedItem('profession') as HTMLInputElement).value;
                    
                    handleUpdateProfile({
                      ...user,
                      phone,
                      education,
                      profession
                    });
                  }}>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Educational Info</label>
                        <input name="education" defaultValue={user.education} className="w-full p-3 bg-gray-50 rounded-lg border-none font-medium text-gray-700" placeholder="Your degree" />
                        <input name="profession" defaultValue={user.profession} className="w-full p-3 bg-gray-50 rounded-lg border-none font-medium text-gray-700" placeholder="Current profession" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</label>
                        <input name="phone" defaultValue={user.phone} className="w-full p-3 bg-gray-50 rounded-lg border-none font-medium text-gray-700" placeholder="Phone number" />
                        <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-brand-600 transition-colors">
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </form>
               </div>
            </div>
          </div>
        )}

        {/* --- ADMIN DASHBOARD --- */}
        {view === 'admin' && user?.role === UserRole.ADMIN && (
          <DashboardAdmin 
            feedbacks={feedbacks} 
            onAddUpdate={handleAddUpdate} 
            onAddContent={handleAddContent}
            user={user}
          />
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 text-white">
             <GraduationCap className="w-8 h-8 text-brand-500" />
             <span className="font-display font-bold text-xl">Bold Scholars</span>
           </div>
           <div className="text-sm">
             © {new Date().getFullYear()} Bold Scholars. Designed for Excellence.
           </div>
        </div>
      </footer>

      {activeDocument && (
        <DocumentViewer item={activeDocument} onClose={() => setActiveDocument(null)} />
      )}
    </div>
  );
}

// Extracted Admin Component for cleaner code
const DashboardAdmin = ({ feedbacks, onAddUpdate, onAddContent, user }: any) => {
  const [activeSection, setActiveSection] = useState<'Knowledge Vault' | 'SET/NET'>('Knowledge Vault');
  const [uploading, setUploading] = useState(false);
  
  // Dynamic subcategories based on active section
  const subCategories = activeSection === 'Knowledge Vault' 
    ? ['Course Materials', 'Study Guides', 'E-Books & PDFs', 'FAQs']
    : ['Course Materials', 'Exam Overview', 'Practice Papers', 'Tips & Strategy'];

  // Handle file upload
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const subCat = (form.elements.namedItem('subCategory') as HTMLSelectElement).value as any;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    const file = fileInput.files[0];
    setUploading(true);

    try {
      // 1. Upload file to Firebase Storage
      const storageRef = ref(storage, `materials/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Save metadata to Firestore
      await onAddContent({
        title,
        description: "Uploaded via Admin Dashboard",
        fileUrl: downloadURL,
        type: file.type.includes('video') ? 'video' : 'pdf',
        category: activeSection,
        subCategory: subCat,
        date: new Date().toISOString().split('T')[0],
        locked: true
      });

      alert("Uploaded successfully!");
      form.reset();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900">Admin Control Center</h2>
        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-100">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-bold text-sm">Super Admin: {user.email}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Content Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <UploadCloud className="w-6 h-6 text-brand-600" />
             <h3 className="text-xl font-bold text-gray-800">Upload Learning Material</h3>
          </div>
          
          <form onSubmit={handleFileUpload}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Section</label>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => setActiveSection('Knowledge Vault')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeSection === 'Knowledge Vault' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
                  >
                    Vault
                  </button>
                  <button 
                     type="button"
                    onClick={() => setActiveSection('SET/NET')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeSection === 'SET/NET' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
                  >
                    Mastery
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sub-Category</label>
                <select name="subCategory" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                  {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-6">
               <label className="block text-sm font-bold text-gray-700 mb-2">Document Title</label>
               <input name="title" required placeholder="ex: Advanced Algorithms Notes" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>

            <div className="mb-6">
               <label className="block text-sm font-bold text-gray-700 mb-2">File Upload</label>
               <input type="file" name="file" required className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <button type="submit" disabled={uploading} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors disabled:bg-gray-400">
              {uploading ? "Uploading..." : "Publish Content"}
            </button>
          </form>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
           {/* Post Update */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ScrollText className="w-5 h-5 text-accent-500"/> Post Announcement</h3>
             <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                onAddUpdate({
                  title: (form.elements.namedItem('title') as HTMLInputElement).value,
                  content: (form.elements.namedItem('content') as HTMLTextAreaElement).value,
                  date: new Date().toISOString().split('T')[0],
                  author: user.name
                });
                form.reset();
                alert("Announcement Posted");
             }}>
               <input name="title" required placeholder="Update Title" className="w-full mb-3 p-3 bg-gray-50 rounded-lg border-none text-sm" />
               <textarea name="content" required placeholder="Message..." className="w-full mb-3 p-3 bg-gray-50 rounded-lg border-none text-sm h-24 resize-none" />
               <button className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-gray-800">Post</button>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;