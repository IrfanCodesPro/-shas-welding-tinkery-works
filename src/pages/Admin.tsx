import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { LogOut, Plus, Trash2, Image as ImageIcon, Loader2, Flame, Folder, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { STATIC_PROJECTS } from '../constants/gallery';
import Logo from '../components/Logo';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We'll show this to the user in a better way
  return errInfo.error;
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [projects, setProjects] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Welding');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error('Snapshot error:', error);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Sha'S" && password === '6382378840') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');
    
    const path = 'projects';
    try {
      // Sanitize filename: remove special characters and spaces
      const sanitizedName = newFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = ref(storage, `gallery/${Date.now()}_${sanitizedName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, newFile);

      // Wrap uploadTask in a Promise to use await properly
      await new Promise<void>((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, 
          (err) => {
            console.error('Upload task error:', err);
            reject(new Error('Storage Upload Error: ' + err.message));
          }, 
          () => resolve()
        );
      });

      const url = await getDownloadURL(uploadTask.snapshot.ref);
      console.log('Got URL, adding to Firestore...');

      await addDoc(collection(db, path), {
        title: newTitle,
        category: newCategory,
        imageUrl: url,
        createdAt: serverTimestamp()
      });

      setNewTitle('');
      setNewFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      console.log('Successfully added project');
    } catch (err) {
      console.error('Error in handleUpload:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      // Use handleFirestoreError if it's likely a Firestore error
      if (errorMsg.includes('permission') || errorMsg.includes('FirebaseError')) {
        setError('Database Error: ' + handleFirestoreError(err, OperationType.CREATE, path));
      } else {
        setError(errorMsg);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const path = `projects/${id}`;
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <div className="flex flex-col items-center gap-6 mb-8">
             <Logo iconOnly className="!gap-0" />
             <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Admin Portal</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-orange-600 transition-all uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95"
            >
              LOG IN
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-32 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo />
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic">Dashboard</h1>
              <p className="text-slate-500 font-medium">Manage your workshop showcase content.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-100 transition-all font-bold uppercase text-xs tracking-widest shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-10">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-32">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
                <Plus className="w-8 h-8 text-orange-600" /> New Project
              </h2>
              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Project Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Main Gate"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Service Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 font-bold"
                  >
                    <option>Welding</option>
                    <option>Fabrication</option>
                    <option>Auto Repair</option>
                    <option>Structural</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Image File</label>
                  <div className="relative">
                    <input 
                      id="file-input"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => document.getElementById('file-input')?.click()}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-orange-500 hover:text-orange-600 transition-all font-bold flex items-center justify-center gap-2"
                    >
                      {newFile ? newFile.name : <><ImageIcon className="w-5 h-5" /> Select Image</>}
                    </button>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-700 transition-all flex flex-col items-center justify-center gap-1 uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-white" /> 
                        {uploadProgress > 0 && uploadProgress < 100 ? `UPLOADING ${Math.round(uploadProgress)}%` : 'PROCESSING...'}
                      </div>
                      <div className="w-full max-w-[200px] h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>POST TO GALLERY</>
                  )}
                </button>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-red-600 uppercase tracking-tight">{error}</p>
                  </motion.div>
                )}
              </form>
            </div>
          </div>

          {/* List of Projects */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                  <ImageIcon className="w-6 h-6 text-slate-400" /> LIVE RECENT WORKS ({projects.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 flex items-center gap-6 hover:bg-slate-50/50 transition-all group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <img src={project.imageUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-xl uppercase tracking-tight">{project.title}</h4>
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">{project.category}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">{project.id}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-4 bg-slate-50 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all rounded-2xl"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="p-24 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                       <ImageIcon className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Waiting for first project upload...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Permanent Gallery Folder */}
            <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 text-white border border-slate-800">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                    <Folder className="w-6 h-6 text-orange-500" /> PERMANENT ARCHIVE (galary folder)
                  </h2>
                  <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {STATIC_PROJECTS.length} IMAGES
                  </span>
               </div>
               <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {STATIC_PROJECTS.map(img => (
                    <div key={img.id} className="aspect-square rounded-lg overflow-hidden border border-slate-800 group relative">
                       <img src={img.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    </div>
                  ))}
               </div>
               <div className="mt-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Technical Note</p>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    The images above are loaded directly from your <code className="text-orange-500 bg-slate-900 px-2 py-0.5 rounded">/public/galary</code> folder. These are preserved as static assets. New uploads via the form above go to Firebase Cloud Storage for real-time updates.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
