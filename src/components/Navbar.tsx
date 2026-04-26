import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Logo from './Logo';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const phoneNumber = "6382378840";

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'site'), (snapshot) => {
      if (snapshot.exists()) {
        setLogoUrl(snapshot.data().logoUrl);
      }
    });
    return () => unsubscribe();
  }, []);

  const scrollTo = (id: string) => {
    if (location.pathname !== '/') {
        window.location.href = `/#${id}`;
        return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="group">
            <Logo logoUrl={logoUrl} />
          </Link>
          
          {/* Desktop Nav */}
          {!isAdminPage && (
            <div className="hidden md:flex items-center gap-10">
              {['About', 'Services', 'Gallery', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors uppercase tracking-[0.2em]"
                >
                  {item}
                </button>
              ))}
              <a
                href={`tel:${phoneNumber}`}
                className="bg-slate-900 text-white px-7 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
              >
                Call Now
              </a>
            </div>
          )}

          {isAdminPage && (
             <Link to="/" className="text-xs font-bold text-slate-500 hover:text-orange-600 uppercase tracking-widest">
               Back to Website
             </Link>
          )}

          {/* Mobile Nav Trigger */}
          {!isAdminPage && (
            <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-slate-100"
          >
            <div className="p-6 flex flex-col gap-6">
              {['About', 'Services', 'Gallery', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-2xl font-black text-slate-900 text-left uppercase tracking-tight"
                >
                  {item}
                </button>
              ))}
              <a
                href={`tel:${phoneNumber}`}
                className="bg-orange-600 text-white px-4 py-5 rounded-2xl text-center font-black uppercase tracking-widest text-lg shadow-xl shadow-orange-100"
              >
                CALL NOW
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
