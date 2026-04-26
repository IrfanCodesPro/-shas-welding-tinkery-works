import React from 'react';
import Logo from './Logo';

export default function Footer() {
  const phoneNumber = "6382378840";
  
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <div className="mb-8">
              <Logo />
            </div>
            <p className="text-slate-400 max-w-sm mb-10 leading-relaxed text-lg italic">
              Your reliable partner for all your welding and automotive tinkery needs since 2014. High-quality work guaranteed in the heart of Tamil Nadu.
            </p>
          </div>
          
          <div>
            <h4 className="font-black text-sm mb-10 uppercase tracking-[0.3em] text-orange-500">Navigation</h4>
            <ul className="space-y-5">
              {['About', 'Services', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => scrollTo(link.toLowerCase())}
                    className="text-slate-400 hover:text-white transition-colors uppercase font-bold text-xs tracking-widest"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm mb-10 uppercase tracking-[0.3em] text-orange-500">Availability</h4>
            <div className="space-y-6">
               <div>
                  <p className="text-xs font-black uppercase text-slate-500 mb-1">Working Days</p>
                  <p className="font-bold text-lg">Mon - Sat: 9 AM - 8 PM</p>
               </div>
               <div>
                  <p className="text-xs font-black uppercase text-slate-500 mb-1">Rest Day</p>
                  <p className="font-bold text-lg text-slate-400">Sundays Closed</p>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-sm font-medium uppercase tracking-widest">© 2026 SHA'S Welding & Tinkery. Crafted for durability.</p>
          <div className="flex gap-8">
             <a href="tel:6382378840" className="text-xs font-black uppercase tracking-tighter text-slate-500 hover:text-white transition-colors">Call: 6382378840</a>
             <a href="#" className="text-xs font-black uppercase tracking-tighter text-slate-500 hover:text-white transition-colors">Tamil Nadu, India</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
