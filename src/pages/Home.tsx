import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Truck, 
  Wrench, 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle, 
  ImagePlus, 
  ArrowRight,
  Menu,
  X,
  Star,
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { STATIC_PROJECTS } from '../constants/gallery';
import { OFFICIAL_LOGO_URL } from '../constants/branding';

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
  throw new Error(JSON.stringify(errInfo));
}

const SERVICES = [
  {
    id: 'welding',
    title: "Structural Welding",
    description: "Expert arc and MIG welding for gates, grills, sheds, and structural steel works. Durable and precision-crafted solutions.",
    icon: <Flame className="w-10 h-10 text-orange-500" />,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'auto-tinkery',
    title: "Auto Tinkering",
    description: "Specialized vehicle body repair, dent removal, and expert tinkering services for autos and transport vehicles.",
    icon: <Truck className="w-10 h-10 text-blue-500" />,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'custom-fab',
    title: "Custom Fabrication",
    description: "Bespoke metal designs, luxury furniture, and architectural elements tailored to your unique aesthetic.",
    icon: <Wrench className="w-10 h-10 text-emerald-500" />,
    image: "/galary/church_chariot.jpeg"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const phoneNumber = "6382378840";
  const whatsappNumber = "916382378840";

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Merge Firestore projects with static images from the galary folder
      setProjects([...dbProjects, ...STATIC_PROJECTS]);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
    });

    const settingsUnsubscribe = onSnapshot(doc(db, 'settings', 'site'), (snapshot) => {
      if (snapshot.exists()) {
        setLogoUrl(snapshot.data().logoUrl);
      }
    });

    return () => {
      unsubscribe();
      settingsUnsubscribe();
    };
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToWhatsApp = () => {
    let text = "Hello SHA'S Welding! I'm interested in a quote.";
    if (uploadedImage) {
      text += " I have a design I'd like to discuss (I've uploaded it on the website).";
    }
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar moved inside App.tsx or rendered here */}
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <ShieldCheck className="w-3 h-3" /> Expert Craftsmanship
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6 uppercase">
                SHA'S <br />
                <span className="text-orange-600 underline underline-offset-8">WELDING & TINKERY</span> WORKS
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                Precision welding, metal fabrication, and expert auto body repair. We bring over 10 years of expertise to every project in Rishivandhiyam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollTo('contact')}
                  className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-xl shadow-orange-200 hover:-translate-y-1"
                >
                  GET A FREE QUOTE <ArrowRight className="w-5 h-5" />
                </button>
                <div 
                  onClick={sendToWhatsApp}
                  className="cursor-pointer border-2 border-slate-200 bg-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:border-emerald-500 hover:text-emerald-600 transition-all hover:-translate-y-1"
                >
                  <MessageCircle className="w-5 h-5" /> WHATSAPP US
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-16 lg:mt-0 relative"
            >
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative rounded-[3rem] overflow-hidden shadow-2xl z-20 border-8 border-white bg-slate-900 group"
              >
                {logoUrl || OFFICIAL_LOGO_URL ? (
                  <img 
                    src={logoUrl || OFFICIAL_LOGO_URL} 
                    alt="Sha's Welding Official Logo" 
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full aspect-square flex flex-col items-center justify-center text-white p-12">
                     <Flame className="w-24 h-24 text-orange-600 mb-6 animate-pulse" />
                     <h2 className="text-3xl font-black uppercase tracking-tighter">SHA'S WELDINGS</h2>
                     <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Crafted for Durability</p>
                  </div>
                )}
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl"
              ></motion.div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-sm font-bold text-orange-600 uppercase tracking-[0.3em] mb-6">Our Story</h2>
              <h3 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 leading-tight uppercase">
                Crafting <span className="text-orange-600 italic">Metal</span> <br />
                Legacy Since 2014
              </h3>
              
              <div className="space-y-8 text-slate-600 text-xl leading-relaxed text-left md:text-center">
                <p>
                  Located in the heart of Rishivandhiyam, <span className="font-bold text-slate-900">Sha's Welding & Tinkary Works</span> has grown from a local workshop into a regional leader in metal fabrication.
                </p>
                <p>
                  Our workshop isn't just about joining metal; it's about building solutions that last a lifetime. Whether it's a reinforced structural gate or a precise auto body repair, we apply the same level of artisan care and engineering precision.
                </p>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 pt-10"
                >
                  <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors">
                    <Zap className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">Quick Turnaround</span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors">
                    <ShieldCheck className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">Certified Quality</span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors">
                    <Star className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">10+ Years</span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors">
                    <CheckCircle className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">Fair Pricing</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-orange-600 uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Expert Solutions for Every Metal Work</p>
            <div className="h-1.5 w-24 bg-orange-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {SERVICES.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group relative bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all h-full"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <div className="mb-6 inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:rotate-6 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-[0.3em] mb-4">Our Works</h2>
            <p className="text-4xl md:text-5xl font-black mb-4">Project Gallery</p>
            <p className="text-slate-400 text-lg">Real photos of our craftsmanship from our workshop.</p>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
               <Loader2 className="w-10 h-10 animate-spin mb-4" />
               <p>Loading gallery...</p>
             </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {projects.length > 0 ? (
                projects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    className="relative group aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-orange-500 text-[10px] uppercase font-bold tracking-widest mb-1">{project.category}</span>
                      <h4 className="font-bold text-lg">{project.title}</h4>
                    </div>
                  </motion.div>
                ))
              ) : (
                 <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                   <p className="text-slate-500 text-lg">Works will be uploaded by admin soon.</p>
                 </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Quote CTA & Image Upload */}
      <section id="quote-action" className="py-20 bg-slate-900 text-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-600 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden">
             <div className="relative z-10 md:grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight uppercase italic">Have a custom design?</h2>
                  <p className="text-orange-100 text-xl mb-10 opacity-90 font-medium">Upload your drawing or sample image. We'll give you an estimate instantly via WhatsApp.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95"
                    >
                      <ImagePlus className="w-6 h-6" /> {uploadedImage ? "Change Image" : "Upload Design"}
                    </button>
                    <button 
                      onClick={sendToWhatsApp}
                      className="bg-white text-orange-600 px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-orange-50 transition-all active:scale-95"
                    >
                      <MessageCircle className="w-6 h-6" /> WhatsApp Quote
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div className="mt-12 md:mt-0 flex justify-center">
                  <div className="relative w-full max-w-sm aspect-square bg-white shadow-2xl rounded-[2.5rem] p-4 flex items-center justify-center">
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Uploaded Design" className="w-full h-full object-cover rounded-[2rem]" />
                    ) : (
                      <div className="w-full h-full border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                        <ImagePlus className="w-16 h-16 mb-4 opacity-50" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Design Preview</p>
                      </div>
                    )}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Map & Contact */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm font-bold text-orange-600 uppercase tracking-[0.3em] mb-4">Get in Touch</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">Let's Build Something Durable Together</p>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <MapPin className="w-7 h-7 text-orange-600 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">Workshop Address</h4>
                    <p className="text-slate-600 leading-relaxed text-lg italic">Sha'S Welding and Tinkary Works, <br />Rishivandhiyam, Vanapuram TK, <br />Kallakurichi District, Tamil Nadu - 606205</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <Phone className="w-7 h-7 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">Call Support</h4>
                    <p className="text-slate-600 leading-relaxed text-lg font-bold text-2xl">
                      <a href={`tel:${phoneNumber}`}>+91 {phoneNumber}</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <MessageCircle className="w-7 h-7 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">Direct WhatsApp</h4>
                    <p className="text-slate-600 leading-relaxed text-lg font-bold text-2xl hover:text-emerald-600 transition-colors cursor-pointer" onClick={sendToWhatsApp}>
                      +91 {phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="pt-8">
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=Sha%27S+Welding+and+Tinkary+Works+Rishivandhiyam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                  >
                    <MapPin className="w-5 h-5" /> GET DIRECTIONS
                  </a>
                </div>
              </div>
            </div>

            <div className="h-[500px] rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl relative">
              <iframe 
                src="https://maps.google.com/maps?q=Sha%27S+Welding+and+Tinkary+Works+Rishivandhiyam&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                title="Workshop Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer rendered in App.tsx or here */}
    </div>
  );
}
