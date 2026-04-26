import React from 'react';
import { Flame } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../constants/branding';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  logoUrl?: string | null;
}

export default function Logo({ className = "", iconOnly = false, logoUrl = null }: LogoProps) {
  const finalLogo = logoUrl || OFFICIAL_LOGO_URL;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        <img 
          src={finalLogo} 
          alt="Sha's Welding Logo" 
          className="w-12 h-12 object-cover rounded-xl shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform"
          referrerPolicy="no-referrer"
        />
      </div>
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase leading-none italic">
            SHA'S
          </span>
          <span className="text-[10px] font-black tracking-[0.2em] text-orange-600 uppercase leading-none mt-1">
             Weldings
          </span>
        </div>
      )}
    </div>
  );
}
