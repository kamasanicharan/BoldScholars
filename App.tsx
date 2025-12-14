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
  Trash2,
  UserCog,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, UserProfile, ViewState, ContentItem, UpdatePost, Feedback, VaultSubCategory, MasterySubCategory } from './types';
import { DocumentViewer } from './components/DocumentViewer';

// Firebase Imports
import { 
  auth, 
  googleProvider, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile
} from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  where,
  getDocs
} from 'firebase/firestore';

// --- Shared Components ---

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500 blur-lg opacity-50 rounded-full animate-pulse"></div>
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-900 text-white p-2.5 rounded-xl shadow-xl border border-white/10">
        <GraduationCap className="w-7 h-7" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="font-display font-bold text-2xl leading-none text-gray-900 tracking-tight">BOLD</span>
      <span className="font-sans text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase mt-0.5">Scholars</span>
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
  <div className="flex flex-wrap gap-2 p-1.5 bg-white/60 backdrop-blur-md rounded-2xl mb-8 w-fit border border-white/50 shadow-sm mx-auto md:mx-0">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`
          relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
          ${activeTab === tab ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}
        `}
      >
        {activeTab === tab && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-xl border border-gray-100"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10">{tab}</span>
      </button>
    ))}
  </div>
);

const SectionHero = ({ title, subtitle, icon: Icon }: any) => (
  <div className="relative overflow-hidden bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-14 mb-12 shadow-2xl shadow-slate-900/20 group">
    {/* Animated Background */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/40 transition-colors duration-700"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-600/30 transition-colors duration-700"></div>

    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      <div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-blue-100/80 text-lg max-w-2xl font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
      <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
        <Icon className="w-12 h-12 text-blue-300" />
      </div>
    </div>
  </div>
);

// --- Login Page Component ---

const LoginPage = ({ onLoginSuccess, onCancel }: { onLoginSuccess: () => void, onCancel: () => void }) => {
  const [mode, setMode] = useState<'selection' | 'student-login' | 'admin-login' | 'forgot'>('selection');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleEmailAuth = async () => {
    if(!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if(isRegistering && !fullName) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (isRegistering) {
        // Register Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateAuthProfile(userCredential.user, { displayName: fullName });
      } else {
        // Login Flow
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (err: any) {
      let msg = err.message.replace('Firebase: ', '');
      if (err.code === 'auth/email-already-in-use') msg = "This email is already registered.";
      if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if(!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch(err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render Selection Screen
  if (mode === 'selection') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[70vh] h-[70vh] rounded-full bg-blue-400/20 blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[50vh] h-[50vh] rounded-full bg-purple-400/20 blur-[100px]"></div>
        </div>

        <div className="w-full max-w-4xl z-10">
          <button onClick={onCancel} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
          </button>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Choose your Portal</h2>
            <p className="text-gray-500 text-lg">Select how you want to access Bold Scholars</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => { setMode('student-login'); setIsRegistering(false); }}
              className="group relative bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">I am a Student</h3>
                <p className="text-gray-500">Access the Vault, track your progress, and prepare for exams.</p>
                <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold">
                  Login / Signup <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => { setMode('admin-login'); setIsRegistering(false); }}
              className="group relative bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/20 border border-slate-800 text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">I am an Admin</h3>
                <p className="text-slate-400">Manage content, users, and system updates.</p>
                <div className="mt-8 flex items-center gap-2 text-blue-400 font-bold">
                  Admin Access <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render Login Form (Shared for Student/Admin)
  const isStudent = mode === 'student-login';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
       {/* Background Decor */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[10%] right-[30%] w-[60vh] h-[60vh] rounded-full bg-blue-400/10 blur-[100px]"></div>
       </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md p-8 md:p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 relative z-10"
      >
        <button onClick={() => setMode('selection')} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isStudent ? 'bg-blue-100 text-blue-600' : 'bg-slate-900 text-white'}`}>
            {isStudent ? <GraduationCap className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900">
            {mode === 'forgot' ? 'Reset Password' : (
              isRegistering ? 'Create Account' : (isStudent ? 'Student Login' : 'Admin Login')
            )}
          </h2>
          <p className="text-gray-500 mt-2">
            {mode === 'forgot' 
              ? 'Enter your email to receive a reset link.' 
              : (isRegistering ? 'Fill in your details to get started.' : 'Welcome back! Please enter your details.')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {resetSent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-gray-900 font-bold mb-2">Check your inbox</p>
            <p className="text-gray-500 mb-6">We've sent a password reset link to {email}</p>
            <button onClick={() => setMode('selection')} className="text-blue-600 font-bold hover:underline">Back to Login</button>
          </div>
        ) : (
          <div className="space-y-5">
            {isRegistering && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-medium" 
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-medium" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  {!isRegistering && (
                    <button onClick={() => setMode('forgot')} className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot Password?</button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-medium" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button 
              onClick={() => mode === 'forgot' ? handleForgotPassword() : handleEmailAuth()}
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === 'forgot' ? 'Send Reset Link' : (isRegistering ? 'Create Account' : 'Sign In')}
            </button>

            {mode !== 'forgot' && (
              <>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400 font-medium">Or continue with</span></div>
                </div>

                <button 
                  onClick={handleGoogleAuth}
                  className="w-full py-3.5 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Google
                </button>
              </>
            )}

            {isStudent && mode !== 'forgot' && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  {isRegistering ? "Already have an account?" : "New here?"} 
                  <button onClick={() => setIsRegistering(!isRegistering)} className="text-blue-600 font-bold hover:underline ml-1">
                    {isRegistering ? "Login" : "Create an account"}
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// --- Hero Component ---

const Hero = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => (
  <div className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 px-4 overflow-hidden">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
      
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wider mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          FROM BASICS TO BREAKTHROUGHS
        </motion.div>
        
        <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6 text-gray-900 leading-[1.1] tracking-tight">
          Unlock Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient">Academic Potential</span>
        </h1>
        
        <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
          Access the comprehensive Knowledge Vault and master your exams with curated resources designed for excellence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onNavigate('vault')}
            className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg overflow-hidden shadow-xl shadow-slate-900/20 hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative flex items-center gap-3">
              Explore Vault <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => onNavigate('mastery')}
            className="px-8 py-4 bg-white/50 backdrop-blur-sm text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-white hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
          >
            Visit Mastery Zone
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative hidden lg:block"
      >
        <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-[2rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
           <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Students" 
            className="rounded-3xl shadow-lg w-full object-cover h-[500px]" 
           />
           {/* Community Badge Removed as requested */}
        </div>
        
        {/* Background Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-200/50 to-purple-200/50 rounded-full blur-3xl -z-10 animate-blob"></div>
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

  // --- Authentication & User Logic ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if user profile exists in Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        // Define Super Admin Email
        const SUPER_ADMIN = "boldscholars@gmail.com";
        let role = UserRole.USER;

        // Determine Role
        if (currentUser.email === SUPER_ADMIN) {
           role = UserRole.ADMIN;
        } else if (userSnap.exists() && userSnap.data().role === UserRole.ADMIN) {
           role = UserRole.ADMIN;
        }

        const userData: UserProfile = {
          uid: currentUser.uid,
          name: currentUser.displayName || "Scholar",
          email: currentUser.email || "",
          avatarUrl: currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.email}&background=0D8ABC&color=fff`,
          role: role,
          phone: userSnap.exists() ? userSnap.data().phone : "",
          education: userSnap.exists() ? userSnap.data().education : "",
          profession: userSnap.exists() ? userSnap.data().profession : "",
        };

        // Save/Update user in Firestore
        await setDoc(userRef, { 
          email: currentUser.email,
          role: role, // Ensure role is persisted
          lastLogin: new Date().toISOString()
        }, { merge: true });
        
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setView('home');
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(userRef, {
        phone: updatedUser.phone,
        education: updatedUser.education,
        profession: updatedUser.profession,
        name: updatedUser.name
      }, { merge: true });
      
      // Update Auth Profile Display Name
      if (auth.currentUser && updatedUser.name !== user.name) {
        await updateAuthProfile(auth.currentUser, { displayName: updatedUser.name });
      }

      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to update profile");
    }
  };

  // --- Real-time Data Listeners ---
  useEffect(() => {
    const qContent = query(collection(db, "content"), orderBy("date", "desc"));
    const unsubContent = onSnapshot(qContent, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem));
      setContent(items);
    });

    const qUpdates = query(collection(db, "updates"), orderBy("date", "desc"));
    const unsubUpdates = onSnapshot(qUpdates, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UpdatePost));
      setUpdates(items);
    });

    const qFeedback = query(collection(db, "feedbacks"), orderBy("date", "desc"));
    const unsubFeedback = onSnapshot(qFeedback, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
      setFeedbacks(items);
    });

    return () => { unsubContent(); unsubUpdates(); unsubFeedback(); };
  }, []);

  // --- Handlers ---
  const handleAddUpdate = async (update: UpdatePost) => await addDoc(collection(db, "updates"), update);
  const handleAddContent = async (item: ContentItem) => await addDoc(collection(db, "content"), item);
  const handleAddFeedback = async (feedback: Feedback) => await addDoc(collection(db, "feedbacks"), feedback);
  const handleDeleteContent = async (id: string) => {
    if(confirm("Are you sure you want to delete this item?")) await deleteDoc(doc(db, "content", id));
  }
  const handleDeleteUpdate = async (id: string) => {
    if(confirm("Are you sure you want to delete this announcement?")) await deleteDoc(doc(db, "updates", id));
  }
  const handleViewContent = (item: ContentItem) => setActiveDocument(item); // No longer blocks guest users

  const filteredVaultContent = content.filter(c => c.category === 'Knowledge Vault' && c.subCategory === vaultTab);
  const filteredMasteryContent = content.filter(c => c.category === 'SET/NET' && c.subCategory === masteryTab);

  const NavLink = ({ target, label, icon: Icon }: any) => (
    <button
      onClick={() => { setView(target); setIsMenuOpen(false); }}
      className={`relative group flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 overflow-hidden ${
        view === target 
          ? 'text-white font-semibold shadow-lg shadow-blue-500/30' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
      }`}
    >
      {view === target && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      )}
      <div className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${view === target ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />}
        {label}
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-400 font-medium text-sm animate-pulse">Loading Scholars...</p>
        </div>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (view === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={() => setView('dashboard')} 
        onCancel={() => setView('home')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-gray-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="cursor-pointer" onClick={() => setView('home')}>
              <Logo />
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              <NavLink target="home" label="Home" />
              <NavLink target="vault" label="Vault" icon={BookOpen} />
              <NavLink target="mastery" label="Mastery" icon={ShieldCheck} />
              <NavLink target="connect" label="Connect" icon={MessageSquare} />
              
              <div className="w-px h-6 bg-gray-200 mx-4"></div>

              {user ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setView(user.role === UserRole.ADMIN ? 'admin' : 'dashboard')}
                    className="flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group bg-white/50"
                  >
                    <img src={user.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full bg-gray-200" />
                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">{user.name.split(' ')[0]}</span>
                  </button>
                  <button onClick={handleLogout} title="Logout" className="p-2.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setView('login')} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors shadow-lg shadow-gray-900/10"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
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
              className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                <button onClick={() => { setView('home'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 font-bold text-gray-700">Home</button>
                <button onClick={() => { setView('vault'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 font-bold text-gray-700">Knowledge Vault</button>
                <button onClick={() => { setView('mastery'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 font-bold text-gray-700">Mastery Zone</button>
                <button onClick={() => { setView('connect'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 font-bold text-gray-700">Connect</button>
                
                <div className="border-t border-gray-100 my-2"></div>
                
                {user ? (
                  <>
                    <button onClick={() => { setView(user.role === UserRole.ADMIN ? 'admin' : 'dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl bg-blue-50 font-bold text-blue-700">
                      {user.role === UserRole.ADMIN ? 'Admin Dashboard' : 'My Dashboard'}
                    </button>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-red-500 font-bold">Logout</button>
                  </>
                ) : (
                  <button onClick={() => { setView('login'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl bg-gray-900 text-white font-bold">Login</button>
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
            
            <section className="py-24 px-4 relative overflow-hidden">
               {/* Section Decor */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h2 className="text-3xl font-display font-bold text-gray-900">Latest Announcements</h2>
                      <p className="text-gray-500 mt-2">Stay updated with exam dates and new material.</p>
                   </div>
                   <div className="hidden md:block">
                     <button onClick={() => setView('connect')} className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                       Contact Support <ArrowRight className="w-4 h-4" />
                     </button>
                   </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {updates.length === 0 && (
                    <div className="col-span-2 text-center py-12 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400">No updates posted yet.</p>
                    </div>
                  )}
                  {updates.slice(0, 4).map((update, idx) => (
                    <motion.div 
                      key={update.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all cursor-default relative"
                    >
                      {user?.role === UserRole.ADMIN && (
                         <button onClick={() => handleDeleteUpdate(update.id)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-20">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      )}
                      <div className="flex justify-between items-start mb-6">
                        <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full">
                          <ScrollText className="w-3 h-3" /> {update.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{update.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{update.content}</p>
                      {user?.role === UserRole.ADMIN && (
                           <div className="mt-4 text-xs text-gray-400">Posted by {update.author}</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all group relative flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3.5 rounded-2xl ${item.type === 'pdf' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'} group-hover:scale-110 transition-transform`}>
                        {item.type === 'pdf' ? <FileText className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                      </div>
                      {user?.role === UserRole.ADMIN && (
                        <button onClick={() => handleDeleteContent(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 leading-tight">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">{item.description}</p>
                    <button 
                      onClick={() => handleViewContent(item)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-900 hover:text-white hover:border-transparent transition-all"
                    >
                      Read Material
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredVaultContent.length === 0 && (
              <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200">
                <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-sm">
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
              title="SET/NET Mastery" 
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
                    className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all relative"
                  >
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-xl text-amber-600 shrink-0">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-bold text-lg text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                    </div>
                     {user?.role === UserRole.ADMIN && (
                        <button onClick={() => handleDeleteContent(item.id)} className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    <button 
                      onClick={() => handleViewContent(item)}
                      className="shrink-0 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-gray-900/20"
                    >
                      Access Content
                    </button>
                  </motion.div>
                ))}
                {filteredMasteryContent.length === 0 && (
                   <div className="text-center py-12 text-gray-500">No content available for {masteryTab} yet.</div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-100 sticky top-24">
                  <h3 className="font-bold text-amber-900 mb-6 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" /> Quick Tips
                  </h3>
                  <ul className="space-y-4 text-sm text-amber-800">
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
                      <span>Review previous year papers at least twice.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
                      <span>Focus on Paper 1 (Teaching Aptitude) for easy scoring.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
                      <span>Keep a formula sheet for quick revision.</span>
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
            <div className="grid md:grid-cols-2 gap-12 bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
              <div className="p-12 flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
                
                <div className="relative z-10">
                  <span className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-4 inline-block">Get in Touch</span>
                  <h2 className="text-4xl font-display font-bold mb-6">We'd love to hear from you.</h2>
                  <p className="text-slate-400 mb-8 text-lg">Have a suggestion for the Knowledge Vault? Found a bug? Or just want to say hi?</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-blue-400">
                        <Mail className="w-6 h-6" />
                      </div>
                      <span className="font-medium text-lg">boldscholars@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-blue-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <span className="font-medium text-lg">Join our Community</span>
                    </div>
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
                    <input type="text" disabled={!!user} defaultValue={user?.name || ''} placeholder="Guest" className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
                    <textarea name="message" required className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all h-40 resize-none outline-none font-medium" placeholder="Tell us what's on your mind..."></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all shadow-lg shadow-blue-500/30">
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
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">My Dashboard</h2>
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
               <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-900 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 <div className="absolute -bottom-16 left-8">
                   <div className="relative">
                      <img src={user.avatarUrl} className="w-32 h-32 rounded-[2rem] border-[6px] border-white shadow-xl bg-white object-cover" alt="Profile" />
                   </div>
                 </div>
               </div>
               
               <div className="pt-20 pb-12 px-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">{user.name}</h3>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Active Scholar
                    </span>
                  </div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                    const education = (form.elements.namedItem('education') as HTMLInputElement).value;
                    const profession = (form.elements.namedItem('profession') as HTMLInputElement).value;
                    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                    
                    handleUpdateProfile({
                      ...user,
                      name,
                      phone,
                      education,
                      profession
                    });
                  }}>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-gray-900 font-bold border-b border-gray-100 pb-2">
                          <UserCog className="w-5 h-5 text-blue-600" /> Personal Info
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
                          <input name="name" defaultValue={user.name} className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Educational Info</label>
                          <input name="education" defaultValue={user.education} className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" placeholder="Your degree" />
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-gray-900 font-bold border-b border-gray-100 pb-2">
                          <BookOpen className="w-5 h-5 text-blue-600" /> Contact & Career
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Profession</label>
                          <input name="profession" defaultValue={user.profession} className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" placeholder="Current profession" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                          <input name="phone" defaultValue={user.phone} className="w-full p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium" placeholder="+91 ..." />
                        </div>
                        
                        <div className="pt-4">
                           <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg">
                             Save Changes
                           </button>
                        </div>
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
           <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg text-white">
               <GraduationCap className="w-6 h-6" />
             </div>
             <span className="font-display font-bold text-xl text-white">Bold Scholars</span>
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

// Extracted Admin Component
const DashboardAdmin = ({ feedbacks, onAddUpdate, onAddContent, user }: any) => {
  const [activeTab, setActiveTab] = useState<'content' | 'team' | 'feedback'>('content');
  const [activeSection, setActiveSection] = useState<'Knowledge Vault' | 'SET/NET'>('Knowledge Vault');
  const [uploading, setUploading] = useState(false);
  
  // Team Management State
  const [teamEmail, setTeamEmail] = useState('');
  const [teamLoading, setTeamLoading] = useState(false);
  const [adminList, setAdminList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Admins
    if (activeTab === 'team') {
      const q = query(collection(db, "users"), where("role", "==", "admin"));
      getDocs(q).then(snap => {
        setAdminList(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });
    }
  }, [activeTab]);

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!teamEmail) return;
    setTeamLoading(true);
    try {
      const q = query(collection(db, "users"), where("email", "==", teamEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing user
        const docRef = querySnapshot.docs[0].ref;
        await setDoc(docRef, { role: UserRole.ADMIN }, { merge: true });
        alert(`${teamEmail} has been promoted to Admin.`);
      } else {
        alert("User not found. Please ask them to sign up as a Student first, then add them here.");
      }
      setTeamEmail('');
    } catch (e) {
      console.error(e);
      alert("Error adding admin.");
    } finally {
      setTeamLoading(false);
    }
  };

  const subCategories = activeSection === 'Knowledge Vault' 
    ? ['Course Materials', 'Study Guides', 'E-Books & PDFs', 'FAQs']
    : ['Course Materials', 'Exam Overview', 'Practice Papers', 'Tips & Strategy'];

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
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/upload.php', { method: 'POST', body: formData });
      const data = await response.json();

      if (!data.success) throw new Error(data.error || 'Upload failed');

      await onAddContent({
        title,
        description: "Uploaded via Admin Dashboard",
        fileUrl: data.url,
        type: file.type.includes('video') ? 'video' : 'pdf',
        category: activeSection,
        subCategory: subCat,
        date: new Date().toISOString().split('T')[0],
        locked: false 
      });

      alert("Uploaded successfully!");
      form.reset();
    } catch (error: any) {
      console.error(error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-display font-bold text-gray-900">Admin Control Center</h2>
        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto">
           <button 
             onClick={() => setActiveTab('content')} 
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
           >
             Content & Updates
           </button>
           <button 
             onClick={() => setActiveTab('team')} 
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'team' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
           >
             Manage Team
           </button>
           <button 
             onClick={() => setActiveTab('feedback')} 
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'feedback' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
           >
             User Feedback
           </button>
        </div>
      </div>

      {activeTab === 'content' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <UploadCloud className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Upload Learning Material</h3>
            </div>
            
            <form onSubmit={handleFileUpload}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Section</label>
                  <div className="flex gap-2 p-1.5 bg-gray-50 rounded-xl border border-gray-200">
                    <button type="button" onClick={() => setActiveSection('Knowledge Vault')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeSection === 'Knowledge Vault' ? 'bg-white shadow-sm text-blue-600 border border-gray-100' : 'text-gray-500'}`}>Vault</button>
                    <button type="button" onClick={() => setActiveSection('SET/NET')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeSection === 'SET/NET' ? 'bg-white shadow-sm text-blue-600 border border-gray-100' : 'text-gray-500'}`}>Mastery</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sub-Category</label>
                  <select name="subCategory" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700">
                    {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Document Title</label>
                <input name="title" required placeholder="ex: Advanced Algorithms Notes" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">File Upload</label>
                <div className="relative">
                  <input type="file" name="file" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>

              <button type="submit" disabled={uploading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors disabled:bg-gray-400 flex justify-center gap-2">
                {uploading && <Loader2 className="w-5 h-5 animate-spin"/>}
                {uploading ? "Uploading..." : "Publish Content"}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900"><ScrollText className="w-5 h-5 text-blue-500"/> Post Announcement</h3>
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
                <input name="title" required placeholder="Update Title" className="w-full mb-3 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm font-medium outline-none transition-all" />
                <textarea name="content" required placeholder="Message..." className="w-full mb-4 p-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm h-32 resize-none font-medium outline-none transition-all" />
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">Post Update</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Invite New Admin</h3>
              <p className="text-sm text-gray-500 mb-6">Enter the email of an existing Student user to promote them to Admin status.</p>
              
              <form onSubmit={handleInviteAdmin}>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">User Email</label>
                  <input 
                    type="email" 
                    value={teamEmail}
                    onChange={(e) => setTeamEmail(e.target.value)}
                    required 
                    placeholder="student@example.com" 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
                  />
                </div>
                <button disabled={teamLoading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors flex justify-center gap-2">
                   {teamLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                   Promote to Admin
                </button>
              </form>
           </div>
           
           <div className="lg:col-span-2 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-gray-200">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Current Admin Team</h3>
             <div className="space-y-4">
                {adminList.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {admin.name ? admin.name[0] : 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{admin.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{admin.email}</p>
                        </div>
                     </div>
                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Active</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-gray-200 min-h-[500px]">
           <div className="flex items-center gap-3 mb-8">
             <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
               <MessageSquare className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-2xl font-bold text-gray-900">User Feedback</h3>
               <p className="text-gray-500">Messages sent via the Connect form.</p>
             </div>
           </div>
           
           <div className="grid gap-4">
              {feedbacks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No feedback received yet.</p>
                </div>
              )}
              {feedbacks.map((f: any) => (
                <div key={f.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-xs">
                         {f.user[0]}
                       </span>
                       <span className="font-bold text-gray-900">{f.user}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{f.date}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed ml-10 bg-gray-50 p-4 rounded-xl rounded-tl-none text-sm">{f.message}</p>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default App;