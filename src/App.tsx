/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Instagram, 
  Facebook,
  Music,
  MapPin, 
  Phone, 
  ChevronRight, 
  Menu as MenuIcon, 
  X, 
  ChevronDown, 
  Clock,
  ArrowLeft,
  UtensilsCrossed,
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Send,
  Home,
  Navigation,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Page = 'home' | 'pizza' | 'burger' | 'tacos' | 'texmex' | 'full_menu';

interface MenuItem {
  name: string;
  price: number | { standard: number; large: number } | { s: number; m: number; l: number };
  description?: string;
  image?: string;
  base?: 'tomato' | 'cream';
}

interface CartItem {
  cartId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  sauce?: string;
  isMenu?: boolean;
  supplements?: string[];
}

interface UserInfo {
  name: string;
  phone: string;
  address: string;
  method: 'delivery' | 'pickup';
  timeslot: string;
  payment: 'cash' | 'card';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

const ReviewCard = ({ name, initials, rating, date, text, tags }: { 
    name: string; 
    initials: string; 
    rating: number; 
    date: string; 
    text: string; 
    tags: string[]; 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongText = text.length > 150;
    const displayText = isExpanded ? text : text.slice(0, 150) + (isLongText ? '...' : '');

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 relative group flex flex-col h-full"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg">
                    {initials}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">{name}</h4>
                    <div className="flex items-center gap-1">
                         {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-red-600 text-red-600' : 'text-slate-300'}`} />
                        ))}
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">{date}</p>
                </div>
            </div>
            <div className="flex-grow">
                <p className="text-slate-600 text-[13px] md:text-sm leading-relaxed mb-4">
                    "{displayText}"
                </p>
                {isLongText && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-red-600 text-[11px] font-black uppercase tracking-widest mb-4 hover:underline"
                    >
                        {isExpanded ? 'Voir moins' : 'Voir plus'}
                    </button>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-auto">
                {tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

// --- Data ---
const PIZZA_MENU: MenuItem[] = [
  // Base Tomate
  { name: 'Marguerita', price: { standard: 450, large: 800 }, description: 'Sauce tomate, fromage, olives.', base: 'tomato', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=400&auto=format&fit=crop' },
  { name: 'Thon', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, thon, oignons, olives.', base: 'tomato', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { name: 'Poulet', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, poulet, olives.', base: 'tomato', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop' },
  { name: 'Viande Hachée', price: { standard: 650, large: 1200 }, description: 'Sauce tomate, fromage, viande hachée, olives.', base: 'tomato', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { name: 'Vegie', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, poivrons, oignons, tomate fraîche, aubergines, olives.', base: 'tomato', image: 'https://images.unsplash.com/photo-1528137871350-5fca72322bcd?q=80&w=400&auto=format&fit=crop' },
  { name: 'Oriental', price: { standard: 650, large: 1200 }, description: 'Sauce tomate, fromage, merguez, poivrons, olives.', base: 'tomato', image: 'https://images.unsplash.com/photo-1593504049359-74330189a355?q=80&w=400&auto=format&fit=crop' },
  { name: 'BBQ', price: { standard: 700, large: 1300 }, description: 'Sauce tomate, fromage, viande hachée, oeuf, poivrons, olives, sauce BBQ.', base: 'tomato', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop' },
  { name: '3 Fromages', price: { standard: 750, large: 1400 }, description: 'Sauce tomate, mozzarella, gruyère, boursin, olives.', base: 'tomato', image: 'https://images.unsplash.com/photo-151152857478e-94fbbf0d7414?q=80&w=400&auto=format&fit=crop' },
  // Base Crème
  { name: 'Forestière', price: { standard: 750, large: 1400 }, description: 'Crème fraîche, fromage, poulet fumé, oignons, champignons, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=400&auto=format&fit=crop' },
  { name: 'Tartiflette', price: { standard: 750, large: 1400 }, description: 'Crème fraîche, fromage, poulet fumé, champignons, pomme de terre, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=400&auto=format&fit=crop' },
  { name: 'Boisée', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, poivrons, sauce fromagère.', base: 'cream', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=400&auto=format&fit=crop' },
  { name: 'Boursin', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, boursin, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { name: 'Raclette', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, raclette, pomme de terre, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=400&auto=format&fit=crop' },
  { name: "L'Artisanale", price: { standard: 900, large: 1700 }, description: 'Crème fraîche ou sauce tomate, viande hachée, poulet fumé, boursin, olives.', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400&auto=format&fit=crop' },
  { name: 'Saumon', price: { standard: 1100, large: 2100 }, description: 'Crème fraîche, fromage, saumon, oignons, boursin.', base: 'cream', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
];

const BURGER_MENU: MenuItem[] = [
  { name: 'Cheese Burger', price: 300, description: 'Steak, slice, salade, tomate, sauce au choix.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop' },
  { name: 'Chicken Crispy', price: 450, description: 'Chicken, slice, salade, tomate, sauce au choix.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop' },
  { name: 'Double Cheese', price: 600, description: '2 Steaks, 2 slices, salade, tomate, sauce au choix.', image: 'https://images.unsplash.com/photo-1550317144-b38c5f693240?q=80&w=400&auto=format&fit=crop' },
  { name: 'Double Chicken Crispy', price: 650, description: '2 Chickens, 2 slices, salade, tomate, sauce au choix.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop' },
  { name: 'Triple Cheese', price: 800, description: '3 Steaks, 3 slices, salade, tomate, sauce au choix.', image: 'https://images.unsplash.com/photo-1550317144-b38c5f693240?q=80&w=400&auto=format&fit=crop' },
  { name: 'Mix Burger', price: 700, description: 'Steak, chicken, 2 slices, salade, tomate, sauce au choix.', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop' },
  { name: 'Le Gourmand', price: 750, description: 'Steak, dinde fumée, slices, salade, tomate, sauce au choix.', image: 'https://images.unsplash.com/photo-1550317144-b38c5f693240?q=80&w=400&auto=format&fit=crop' },
];

const TACOS_MENU: MenuItem[] = [
  { name: 'Le Poulet', price: 550, description: 'Poulet, frites, sauce fromage.', image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=400&auto=format&fit=crop' },
  { name: "L'Indien", price: 600, description: 'Poulet curry, frites, sauce fromage.', image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=400&auto=format&fit=crop' },
  { name: 'Le Tandoori', price: 600, description: 'Poulet tandoori, frites, sauce fromage.', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=400&auto=format&fit=crop' },
  { name: 'Le Mix', price: 600, description: 'Viande hachée, poulet, frites, sauce fromage.', image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=400&auto=format&fit=crop' },
  { name: 'Le Beef', price: 650, description: 'Viande hachée, frites, sauce fromage.', image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=400&auto=format&fit=crop' },
  { name: 'Le Crispy', price: 650, description: 'Poulet crispy, frites, sauce fromage.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop' },
  { name: 'Le Fermier', price: 650, description: 'Dinde fumée, poulet, frites, sauce fromage.', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=400&auto=format&fit=crop' },
  { name: 'Le Farmer', price: 700, description: 'Dinde fumée, viande hachée, frites, sauce fromage.', image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=400&auto=format&fit=crop' },
];

const TEXMEX_MENU: MenuItem[] = [
  { name: 'CHICKEN PARTY medium', price: 2000, description: '5 WINGS • 5 TENDERS • 7 NUGGETS • 2 FRITES • 1 BOUTEILLE 1L' },
  { name: 'CHICKEN PARTY xxl', price: 3500, description: '10 WINGS • 10 TENDERS • 14 NUGGETS • 4 FRITES • 1 BOUTEILLE 1L' },
  { name: 'Wrap Poulet', price: 550, description: 'Poulet mariné 24h, crudités croquantes, sauce blanche.' },
  { name: 'Croque-Monsieur', price: 250, description: 'Crème fraîche, dinde fumée, slice, fromage râpé.' },
  { name: 'Barquette Frites x3', price: 300 },
  { name: 'Barquette Frites x5', price: 500 },
  { name: 'Barquette Frites x7', price: 600 },
];

const SUPPLEMENTS = [
  { name: 'Oignons Caramélisés', price: 0 },
  { name: 'Cornichons', price: 0 },
  { name: 'Oeuf / Slice Cheese', price: 50 },
  { name: 'Dinde Fumée', price: 150 },
  { name: 'Menu Frites + Boisson', price: 200 },
  { name: 'Gratinage Tacos', price: 150 },
];

const DESSERT_MENU: MenuItem[] = [
  { name: 'Tiramisu Maison', price: 450, description: 'Le classique italien revisité par notre chef.' },
  { name: 'Mousse au Chocolat', price: 350, description: 'Onctueuse et légère.' },
  { name: 'Panacotta Fruits Rouges', price: 400 },
  { name: 'Cheesecake Citron', price: 500 },
];

const DRINKS = [
  { name: 'Eau 33cl', price: 30 },
  { name: 'Eau gazeuse 33cl', price: 50 },
  { name: 'Jus 33cl', price: 100 },
  { name: 'Canette 33cl', price: 100 },
  { name: 'Boisson gazeuse 1L', price: 150 },
];

const SAUCES = [
  'Ketchup', 'Mayonnaise', 'Moutarde', 'Harissa', 'Burger', 'Algérienne', 'Barbecue', 'Brazil', 'Samourai'
];

// --- Helper Functions ---
const getAlgerTime = () => {
  const now = new Date();
  // Alger is UTC+1. Date object handles local time, but for global consistency:
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 1)); 
};

const checkIsOpen = () => {
  const algerNow = getAlgerTime();
  const day = algerNow.getDay(); // 0 (Sun) to 6 (Sat)
  const hours = algerNow.getHours();
  const minutes = algerNow.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // Matin (Daily except Fri): 07:50–14:50
  const isMidiOpen = day !== 5 && timeInMinutes >= (7 * 60 + 50) && timeInMinutes <= (14 * 60 + 50);

  // Soir (Sat–Wed): 18:30–22:30
  const isEarlySoirOpen = [6, 0, 1, 2, 3].includes(day) && timeInMinutes >= (18 * 60 + 30) && timeInMinutes <= (22 * 60 + 30);

  // Soir (Thu–Fri): 18:30–23:00
  const isLateSoirOpen = [4, 5].includes(day) && timeInMinutes >= (18 * 60 + 30) && timeInMinutes <= (23 * 60);

  return isMidiOpen || isEarlySoirOpen || isLateSoirOpen;
};

// --- Components ---

interface MenuListItemProps {
  item: MenuItem;
  category: string;
  onAddToCart: (variant?: string, priceVal?: number) => void;
  key?: any;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

const MenuListItem = ({ item, category, onAddToCart }: MenuListItemProps) => {
  const price = item.price;
  const startingPrice = typeof price === 'number' ? price : ('standard' in price ? price.standard : price.s);

  return (
    <div className="group py-5 flex flex-col justify-between gap-4 transition-all hover:bg-slate-100/50 rounded-2xl px-4 bg-slate-50/10 md:bg-transparent md:px-2 md:py-6">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-serif text-base md:text-lg font-bold text-slate-950 group-hover:text-red-600 transition-colors leading-tight">
            {item.name}
          </h4>
          <span className="text-sm md:text-base font-black text-slate-950 tabular-nums whitespace-nowrap">
            {startingPrice} <span className="text-[12px] uppercase text-slate-600">DA</span>
          </span>
        </div>
        
        {item.description && (
          <p className="text-slate-600 text-[12px] md:text-sm font-medium leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600/40 group-hover:bg-red-600 transition-colors" />
          <span className="text-[10px] md:text-[11px] font-black uppercase text-slate-400 tracking-wider group-hover:text-slate-500 transition-colors">
            {category === 'pizza' ? 'Au Feu de Bois' : category}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 text-white hover:bg-red-600 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-lg shadow-slate-900/10 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          Commander
        </button>
      </div>
    </div>
  );
};

const Accordion = ({ title, children }: { title: string, children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-t border-slate-100 last:border-b">
      <button 
        id={`accordion-${title.toLowerCase()}`}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-4 md:px-16 lg:px-32 flex items-center justify-between transition-colors hover:bg-slate-50"
      >
        <span className="font-semibold text-slate-800 text-sm md:text-base">{title}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white"
          >
            <div className="px-4 md:px-16 lg:px-32 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({ onMenuClick, onBack, onLogoClick, onOrderClick, title }: { 
    onMenuClick?: () => void, 
    onBack?: () => void, 
    onLogoClick?: () => void,
    onOrderClick?: () => void,
    title?: string 
}) => (
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-12 lg:px-24 py-3">
    <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
        {onBack ? (
        <button onClick={onBack} id="header-back" className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        ) : (
        <button onClick={onLogoClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <UtensilsCrossed className="w-5 h-5 text-red-600" />
            <span className="font-bold text-base md:text-lg tracking-tight">L'Artisanale</span>
        </button>
        )}
        
        <div className="absolute left-1/2 -translate-x-1/2">
        {title && <h1 className="font-semibold text-slate-900 text-sm md:text-base whitespace-nowrap">{title}</h1>}
        </div>
 
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={onOrderClick}
                  className="bg-red-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-red-900/10"
                >
                  Commander en ligne
                </button>
                <button 
                  onClick={() => onMenuClick?.()} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 hover:bg-slate-100 transition-all"
                >
                  <MenuIcon className="w-5 h-5" />
                </button>
            </div>
            {onMenuClick && (
            <button 
                onClick={() => onMenuClick()} 
                id="header-menu" 
                className="md:hidden p-2 -mr-2 rounded-full hover:bg-slate-100"
            >
                <MenuIcon className="w-5 h-5 text-slate-800" />
            </button>
            )}
        </div>
        {!onMenuClick && !onOrderClick && <div className="w-10"></div>}
    </div>
  </header>
);

const NavigationDrawer = ({ isOpen, onClose, onNavigate }: { isOpen: boolean, onClose: () => void, onNavigate: (p: Page, cat?: string) => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 100, mass: 1 }}
          className="fixed inset-0 z-[60] bg-white flex flex-col h-full overflow-hidden"
        >
          {/* Header inside drawer */}
          <div className="flex justify-between items-center px-4 py-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                <UtensilsCrossed className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-slate-900">L'Artisanale</span>
            </div>
            <button 
              onClick={onClose} 
              id="close-drawer" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 flex flex-col justify-center px-4 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Accueil', action: () => onNavigate('home') },
                { label: 'Commander en ligne', action: () => onNavigate('full_menu') },
                { label: 'Adresse', href: 'https://maps.google.com/maps?q=L\'Artisanale+Draria' },
                { label: 'Livraison', href: 'tel:0782777560' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.action ? (
                    <button 
                      onClick={() => { item.action(); onClose(); }}
                      className="group py-2 text-left w-full border-b border-transparent hover:border-slate-100 transition-all"
                    >
                      <span className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-red-600 transition-all duration-300">
                        {item.label}
                      </span>
                    </button>
                  ) : (
                    <a 
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="group py-2 text-left block w-full border-b border-transparent hover:border-slate-100 transition-all"
                    >
                      <span className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-red-600 transition-all duration-300">
                        {item.label}
                      </span>
                    </a>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Footer inside drawer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex gap-8">
                {[
                  { icon: Instagram, href: "https://instagram.com" },
                  { icon: Music, href: "https://tiktok.com" },
                  { icon: Facebook, href: "https://facebook.com" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-red-600 transition-colors transform hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const PriceDisplay = ({ item, onAddToCart }: { item: MenuItem, onAddToCart: (variant?: string, priceVal?: number) => void }) => {
  const { price } = item;
  
  if (typeof price === 'number') {
    return (
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-black text-slate-900 text-xs">{price} DA</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-all hover:bg-red-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const startingPrice = 'standard' in price ? price.standard : price.s;

  return (
    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <div className="flex flex-col items-end leading-none">
        <span className="text-[7px] text-slate-400 font-black uppercase tracking-[0.1em] mb-1">Dès</span>
        <span className="font-black text-red-600 text-xs">{startingPrice} DA</span>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
        className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-xl shadow-lg shadow-red-100 active:scale-95 transition-all"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

const Footer = ({ onNavigate }: { onNavigate?: (p: Page, cat?: string) => void }) => (
  <footer className="w-full mt-auto bg-slate-900 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full" />
    
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-12 lg:px-24 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/50">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold tracking-tight">L'Artisanale</h4>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">Draria • Qualité Supérieure</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-300 font-bold uppercase tracking-widest">DRARIA</p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-medium uppercase">
              LE GOÛT AUTHENTIQUE LIVRÉ CHEZ VOUS
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { icon: Instagram, href: "https://instagram.com" },
              { icon: Music, href: "https://tiktok.com" },
              { icon: Facebook, href: "https://facebook.com" }
            ].map((social, i) => (
              <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-all border border-white/5">
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-4">
          <h5 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-500">Navigation</h5>
          <ul className="space-y-3">
            <li>
              <button 
                onClick={() => onNavigate?.('home')} 
                className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                Accueil
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate?.('full_menu')} 
                className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                La Carte
              </button>
            </li>
            <li>
              <a 
                href="https://www.google.com/maps/search/L'Artisanale+Draria+Alger" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                Adresse
              </a>
            </li>
            <li>
              <button 
                className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                Livraison
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-6">
          <h5 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-500">Contact</h5>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 transition-all">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-0.5 tracking-widest">Par Téléphone</p>
                <p className="text-base font-bold">0782 77 75 60</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 transition-all">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-0.5 tracking-widest">Localisation</p>
                <p className="text-base font-bold">Route des Chwayin, Draria</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/5 flex justify-center items-center">
        <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em]">
          L'ARTISANALE DRARIA 2026
        </p>
      </div>
    </div>
  </footer>
);

const HomePage = ({ onNavigate, onMenuClick, hasCart }: { onNavigate: (p: Page, cat?: string) => void, onMenuClick: () => void, hasCart: boolean }) => {
  const isOpen = checkIsOpen();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onMenuClick={onMenuClick} 
        onOrderClick={() => onNavigate('full_menu')} 
        onLogoClick={() => onNavigate('home')} 
      />
      
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[65vh] flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" 
                alt="Hero Pizza" 
                className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white" />
          
          <div className="relative z-10 text-center px-4 md:px-16 lg:px-24">
            <div className="mb-4 inline-block relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-white/10 backdrop-blur-md mx-auto relative ring-1 ring-white/20">
                    <img 
                        src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=300&h=300&auto=format&fit=crop" 
                        alt="L'Artisanale Logo" 
                        className="w-full h-full rounded-full object-cover border border-white/30"
                        referrerPolicy="no-referrer"
                    />
                    <div className={`absolute bottom-2 right-2 w-5 h-5 md:w-7 md:h-7 rounded-full border-2 border-white ${isOpen ? 'bg-green-500' : 'bg-red-500'} shadow-lg z-10`} />
                </div>
            </div>
            <div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-2 tracking-tight">
                    L'Artisanale
                </h2>
                <div className="flex items-center justify-center gap-3 text-white/90">
                    <div className="h-px w-8 md:w-10 bg-red-600" />
                    <p className="font-black tracking-[0.3em] uppercase text-[10px] md:text-sm">
                        Le Goût Authentique
                    </p>
                    <div className="h-px w-8 md:w-10 bg-red-600" />
                </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10 md:mt-12">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('full_menu')}
                            className="w-[auto] min-w-[250px] bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-900/40 hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Commander en ligne
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const bento = document.getElementById('bento-grid');
                                if (bento) bento.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-[auto] min-w-[200px] bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                        >
                            Voir la carte
                        </motion.button>
                    </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto w-full px-4 md:px-16 lg:px-24 -mt-16 relative z-20 pb-16">
            {/* Quick Link Bio Section */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            >
                <motion.button 
                    variants={childVariants}
                    id="link-order-online"
                    onClick={() => onNavigate('full_menu')}
                    className="w-full bg-slate-900 text-white p-6 md:p-6 rounded-2xl md:rounded-3xl flex items-center justify-between group hover:bg-red-600 transition-all shadow-xl active:scale-[0.98]"
                >
                    <div className="flex items-center gap-4 text-left">
                        <div className="bg-white/10 p-3 md:p-3 rounded-xl">
                            <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <div>
                            <span className="block font-black text-xl md:text-xl leading-tight text-white">Commander en Ligne</span>
                            <span className="text-[10px] md:text-[10px] uppercase opacity-60 font-bold tracking-widest block text-red-100">Service Rapide</span>
                        </div>
                    </div>
                </motion.button>

                <motion.a 
                    variants={childVariants}
                    href="tel:0782777560" 
                    className="bg-white border border-slate-100 p-6 md:p-6 rounded-2xl md:rounded-3xl flex items-center gap-4 text-slate-800 shadow-lg hover:border-red-600 transition-all group active:scale-[0.98]"
                >
                    <div className="bg-red-50 p-3 md:p-3 rounded-xl text-red-600">
                        <Phone className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="text-left">
                        <span className="block font-black text-xl md:text-xl leading-tight">Nous Appeler</span>
                        <span className="text-[10px] md:text-[10px] uppercase text-slate-400 font-bold tracking-widest block">0782 77 75 60</span>
                    </div>
                </motion.a>

                <motion.a 
                    variants={childVariants}
                    href="https://www.google.com/maps/search/L'Artisanale+Draria+Alger" 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-white border border-slate-100 p-6 md:p-6 rounded-2xl md:rounded-3xl flex items-center gap-4 text-slate-800 shadow-lg hover:border-red-600 transition-all group active:scale-[0.98]"
                >
                    <div className="bg-red-50 p-3 md:p-3 rounded-xl text-red-600">
                        <MapPin className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="text-left">
                        <span className="block font-black text-xl md:text-xl leading-tight">Notre Adresse</span>
                        <span className="text-[10px] md:text-[10px] uppercase text-slate-400 font-bold tracking-widest block">Draria, Alger</span>
                    </div>
                </motion.a>
            </motion.div>


            {/* Category Grid - Bento Style Optimized for Desktop */}
            <div id="bento-grid" className="mb-12 md:mb-16">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
                    <div className="flex flex-col text-left">
                        <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Gastronomie</span>
                        <h3 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-none">Explorer l'Univers</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4">
                    {[
                        { id: 'pizza', name: 'Nos Pizzas', subtitle: 'Feu de Bois', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop', span: 'md:col-span-8' },
                        { id: 'burger', name: 'Nos Burgers', subtitle: 'Gourmet', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600&auto=format&fit=crop', span: 'md:col-span-4' },
                        { id: 'tacos', name: 'Nos Tacos', subtitle: 'L\'Authentique', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=600&auto=format&fit=crop', span: 'md:col-span-4' },
                        { id: 'texmex', name: 'Délices Mix', subtitle: 'Tex-Mex', img: 'https://images.unsplash.com/photo-1534080564607-c92751f8933f?q=80&w=600&auto=format&fit=crop', span: 'md:col-span-8' },
                    ].map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => onNavigate('full_menu', cat.id)}
                            className={`relative h-48 md:h-[300px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-lg transition-all duration-700 ${cat.span}`}
                        >
                            <img 
                                src={cat.img} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
                                alt={cat.name} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/10 to-transparent p-6 md:p-8 flex flex-col justify-end">
                                <div className="text-left w-full sm:translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-[10px] md:text-[12px] text-red-500 font-bold uppercase tracking-[0.4em] block mb-2 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                        {cat.subtitle}
                                    </span>
                                    <span className="text-white font-serif text-3xl md:text-5xl font-bold block leading-none">
                                        {cat.name}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-white/50 group-hover:text-white transition-colors duration-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest">En savoir plus</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Nos Incontournables Section */}
            <div className="py-12 md:py-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex flex-col text-left">
                        <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Sélection</span>
                        <h3 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-none">Nos Incontournables</h3>
                    </div>
                    <button 
                        onClick={() => onNavigate('full_menu')} 
                        className="group flex items-center gap-3 text-red-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 px-6 py-3 rounded-full transition-all border border-red-100 self-start md:self-auto"
                    >
                        Tout explorer
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="flex flex-col">
                    {[
                        { name: 'Pizza Saumon', price: '1100 DA', desc: 'Crème fraîche, saumon fumé de qualité, aneth fraîchement coupée.', cat: 'Signature' },
                        { name: 'Double Smash', price: '900 DA', desc: '2 steaks de boeuf 150g, cheddar affiné, sauce secrète Artisanale.', cat: 'Gourmet' },
                        { name: 'Wrap Poulet', price: '550 DA', desc: 'Poulet mariné 24h, crudités croquantes, sauce maison.', cat: 'Authentique' },
                    ].map((item, idx) => (
                        <div 
                            key={idx} 
                            className="group py-8 md:py-10 border-b border-slate-100 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-slate-50/50 px-4 md:px-0"
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
                                    <h4 className="font-serif text-xl md:text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                                        {item.name}
                                    </h4>
                                    <div className="hidden md:block h-px flex-1 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-lg md:text-xl font-black text-slate-900 tabular-nums">
                                        {item.price}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-[13px] md:text-base font-medium leading-relaxed max-w-4xl group-hover:text-slate-600 transition-colors">
                                    {item.desc}
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-1 bg-red-600 group-hover:w-12 transition-all rounded-full" />
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">{item.cat}</span>
                                </div>
                            </div>
                            <div className="pt-2 md:pt-0">
                                <button 
                                    onClick={() => onNavigate('full_menu')} 
                                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 text-white hover:bg-red-600 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-xl shadow-slate-900/10"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Commander
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="w-full bg-white border-b border-slate-100 py-16 md:py-24 mb-16">
                <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                        <div className="flex flex-col text-left">
                            <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Valeurs</span>
                            <h3 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 leading-none">Notre Engagement</h3>
                        </div>
                        <p className="text-slate-400 text-xs md:text-sm max-w-lg font-medium leading-relaxed">
                            Plus qu'une pizzeria, un savoir-faire transmis pour vous offrir le meilleur de la cuisine artisanale.
                        </p>
                    </div>
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {[
                            { 
                                icon: UtensilsCrossed, 
                                title: 'Savoir-Faire', 
                                desc: 'Nos chefs maîtrisent l\'art de la pizza au feu de bois et de la cuisine traditionnelle.',
                                color: 'red'
                            },
                            { 
                                icon: Star, 
                                title: 'Qualité Premium', 
                                desc: 'Des ingrédients frais sélectionnés chaque matin pour une saveur authentique.',
                                color: 'orange'
                            },
                            { 
                                icon: Clock, 
                                title: 'Disponibilité', 
                                desc: 'Ouvert tous les jours avec un service de livraison rapide et efficace à Draria.',
                                color: 'blue'
                            },
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                variants={childVariants}
                                className="group p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-700 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[40px] group-hover:bg-red-600/10 transition-all" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-xl bg-white shadow-xl flex items-center justify-center text-red-600 mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-700">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h4 className="font-serif text-2xl font-bold text-slate-900 mb-4">{item.title}</h4>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium transition-opacity">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Testimonials section optimization for PC */}
            <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 mb-20 md:mb-32">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div className="flex flex-col text-left">
                        <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Avis Clients</span>
                        <h3 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-none">Ce qu'on dit de nous</h3>
                    </div>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-3 bg-red-50 px-6 py-3 rounded-full border border-red-100 shadow-lg shadow-red-900/5 self-start md:self-auto"
                    >
                        <Star className="w-4 h-4 text-red-600 fill-red-600" />
                        <span className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em]">4.8/5 sur Google</span>
                    </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    <ReviewCard 
                        name="Sabrina Bd"
                        initials="S"
                        rating={5}
                        date="il y a 3 mois"
                        text="De passage sur Draria à Alger, belle découverte de la pizzeria l’artisanale ! L’endroit est impeccable, le personnel est très aimable et accueillant. Les produits sont frais et de qualité pour avoir testé les pizzas viande hachée, poulet curry, 3 fromages, tacos et hamburger. Le goût était savoureux et authentique. Je recommande ❤️"
                        tags={["1 avis"]}
                    />

                    <ReviewCard 
                        name="Brice Belkheir"
                        initials="B"
                        rating={5}
                        date="il y a 9 mois"
                        text="Excellente qualité !!! Et très très bon rapport qualité-prix !"
                        tags={["Local Guide", "25 avis", "6 photos"]}
                    />

                    <ReviewCard 
                        name="Synouhi Ko"
                        initials="S"
                        rating={5}
                        date="il y a 10 mois"
                        text="Excellent tacos. Si vous voulez un tacos à la française alors je vous conseille fortement"
                        tags={["Local Guide", "25 avis"]}
                    />
                </div>
            </div>
        </div>

            <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 mt-4 mb-16">
                {/* Localisation Section */}
                <div className="relative overflow-hidden group rounded-[2rem] md:rounded-[3rem]">
                    {/* Background with parallax-like scaling */}
                    <div className="absolute inset-0 bg-slate-900">
                        <motion.img 
                            initial={{ scale: 1.2, opacity: 0.2 }}
                            whileInView={{ scale: 1, opacity: 0.1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1548&auto=format&fit=crop" 
                            alt="Background Draria"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    <div className="relative z-10 p-8 md:p-16 lg:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-left">
                        <div className="max-w-2xl">
                            <span className="text-red-500 font-black text-[9px] uppercase tracking-[0.4em] mb-4 block">Le Rendez-vous</span>
                            <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">Venez nous voir à Draria</h3>
                            <p className="text-slate-400 text-sm md:text-base mb-8 font-medium leading-relaxed">
                                Une ambiance chaleureuse vous attend tous les jours de 11h30 à minuit.
                            </p>
                            
                            <motion.a 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href="https://www.google.com/maps/search/L'Artisanale+Draria+Alger" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl"
                            >
                                <MapPin className="w-4 h-4" />
                                Itinéraire Google Maps
                            </motion.a>
                        </div>
                        
                        {/* Right side info for desktop/tablet */}
                        <div className="hidden md:block">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] w-72 ring-1 ring-white/20">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-red-600 p-2 rounded-xl flex-shrink-0">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <span className="block text-white font-bold text-xs">Horaires</span>
                                            <span className="text-slate-400 text-[10px] uppercase tracking-tighter">11h30 — 00h00</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-red-600 p-2 rounded-xl flex-shrink-0">
                                            <Phone className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <span className="block text-white font-bold text-xs">Contact</span>
                                            <span className="text-slate-400 text-[10px] tracking-tighter">0782 77 75 60</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

      </main>

      {/* Floating Action Menu for Website feel */}
      <AnimatePresence>
        {scrolled && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-6 z-50 transition-all duration-500"
            >
                <a 
                    href="tel:0782777560" 
                    className="w-14 h-14 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-slate-900 transition-all shadow-2xl shadow-red-900/40 group active:scale-95"
                >
                    <Phone className="w-6 h-6 group-hover:animate-bounce" />
                </a>
            </motion.div>
        )}
      </AnimatePresence>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

const MenuPage = ({ category, onBack, onMenuClick, onAddToCart }: { category: Page, onBack: () => void, onMenuClick: () => void, onAddToCart: (item: MenuItem, cat: string, variant?: string, priceVal?: number) => void }) => {
  const [pizzaBase, setPizzaBase] = useState<'tomato' | 'cream'>('tomato');
  const [activeTab, setActiveTab] = useState<'carte' | 'extras'>('carte');

  const menuItems = useMemo(() => {
    switch (category) {
      case 'pizza': return PIZZA_MENU.filter(p => !p.base || p.base === pizzaBase);
      case 'burger': return BURGER_MENU;
      case 'tacos': return TACOS_MENU;
      case 'texmex': return TEXMEX_MENU;
      default: return [];
    }
  }, [category, pizzaBase]);

  const titles = {
    pizza: 'Nos Pizzas',
    burger: 'Nos Burgers',
    tacos: 'Nos Tacos',
    texmex: 'Notre Tex-Mex',
    full_menu: 'La Carte'
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onBack={onBack} onMenuClick={onMenuClick} title={titles[category as keyof typeof titles]} />
      
      {/* Category Hero Image */}
      <div className="w-full h-48 relative overflow-hidden bg-slate-200">
        <img 
          src={`https://picsum.photos/seed/${category}/800/400`} 
          alt={category} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 md:px-8">
        {/* Main View Toggle */}
        <div className="px-6 py-3 md:py-6 sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 mb-2 max-w-lg mx-auto">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex shadow-inner">
                <button 
                  onClick={() => setActiveTab('carte')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'carte' ? 'bg-white shadow-xl text-red-600 scale-[1.02]' : 'text-slate-500'}`}
                >
                  La Carte
                </button>
                <button 
                  onClick={() => setActiveTab('extras')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'extras' ? 'bg-white shadow-xl text-red-600 scale-[1.02]' : 'text-slate-500'}`}
                >
                  Boissons & Desserts
                </button>
            </div>
        </div>

        <AnimatePresence mode="wait">
            {activeTab === 'carte' ? (
                <motion.div 
                    key="carte"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="pb-8"
                >
                    {/* Pizza Toggle */}
                    {category === 'pizza' && (
                    <div className="px-6 mb-8 mt-4">
                        <div className="bg-slate-50 p-1 rounded-xl flex border border-slate-100">
                            <button 
                                id="toggle-tomato"
                                onClick={() => setPizzaBase('tomato')}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${pizzaBase === 'tomato' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
                            >
                                Base Tomate
                            </button>
                            <button 
                                id="toggle-cream"
                                onClick={() => setPizzaBase('cream')}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${pizzaBase === 'cream' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
                            >
                                Base Crème
                            </button>
                        </div>
                    </div>
                    )}

                    {/* Menu Items List */}
                    <motion.div 
                      key={`${category}-${pizzaBase}`}
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05
                          }
                        }
                      }}
                      className="px-4 pt-2 pb-10 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                    >
                    {menuItems.map((item, idx) => (
                        <MenuListItem 
                        key={`${item.name}-${idx}`} 
                        item={item} 
                        category={category} 
                        onAddToCart={(v, p) => onAddToCart(item, category, v, p)} 
                        />
                    ))}
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div 
                    key="extras"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="pb-8"
                >
                    <div className="px-6 py-6 space-y-10">
                        {/* Boissons */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px bg-slate-100 flex-1" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Boissons</h3>
                                <div className="h-px bg-slate-100 flex-1" />
                            </div>
                            <motion.div 
                              initial="hidden"
                              animate="visible"
                              variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                  opacity: 1,
                                  transition: {
                                    staggerChildren: 0.05
                                  }
                                }
                              }}
                              className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                            >
                                {DRINKS.map((drink, idx) => (
                                    <MenuListItem 
                                        key={`${drink.name}-${idx}`}
                                        item={drink as any}
                                        category="drink"
                                        onAddToCart={(v, p) => onAddToCart(drink as any, "drink", v, p)}
                                    />
                                ))}
                            </motion.div>
                        </div>

                        {/* Desserts */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px bg-slate-100 flex-1" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Desserts</h3>
                                <div className="h-px bg-slate-100 flex-1" />
                            </div>
                            <motion.div 
                              initial="hidden"
                              animate="visible"
                              variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                  opacity: 1,
                                  transition: {
                                    staggerChildren: 0.05
                                  }
                                }
                              }}
                              className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                            >
                                {DESSERT_MENU.map((dessert, idx) => (
                                    <MenuListItem 
                                        key={`${dessert.name}-${idx}`}
                                        item={dessert}
                                        category="dessert"
                                        onAddToCart={(v, p) => onAddToCart(dessert, "dessert", v, p)}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="px-10 pb-20 text-center">
            <button 
              id="back-to-home"
              onClick={onBack}
              className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors active:scale-95"
            >
              Retour Accueil
            </button>
        </div>
      </div>
    </div>
  );
};

const CustomizationModal = ({ 
  item, 
  category,
  isOpen, 
  onClose, 
  onConfirm,
  initialVariant,
  initialPrice
}: { 
  item: MenuItem | null, 
  category?: string,
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (sauce?: string, isMenu?: boolean, variant?: string, price?: number, supplements?: string[]) => void,
  initialVariant?: string,
  initialPrice?: number
}) => {
  const [selectedSauce, setSelectedSauce] = useState('');
  const [isMenu, setIsMenu] = useState(false);
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || '');
  const [currentPrice, setCurrentPrice] = useState(initialPrice || 0);

  useEffect(() => {
    if (item) {
      if (initialVariant) {
        setSelectedVariant(initialVariant);
        setCurrentPrice(initialPrice || 0);
      } else if (typeof item.price === 'number') {
        setCurrentPrice(item.price);
      } else if ('standard' in item.price) {
        setSelectedVariant('Standard');
        setCurrentPrice(item.price.standard);
      } else if ('s' in item.price) {
        setSelectedVariant('S');
        setCurrentPrice(item.price.s);
      }
      setSelectedSauce('');
      setIsMenu(false);
      setSelectedSupplements([]);
    }
  }, [item, initialVariant, initialPrice]);

  if (!item) return null;

  const handleVariantChange = (v: string, p: number) => {
    setSelectedVariant(v);
    setCurrentPrice(p);
  };

  const toggleSupplement = (name: string) => {
    setSelectedSupplements(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const supplementsPrice = selectedSupplements.reduce((acc, name) => {
    const supplement = SUPPLEMENTS.find(s => s.name === name);
    return acc + (supplement?.price || 0);
  }, 0);

  const finalPrice = (isMenu ? currentPrice + 250 : currentPrice) + supplementsPrice;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[450px] z-[70] w-full max-h-[90vh] md:max-h-full bg-white rounded-t-[32px] md:rounded-l-[32px] md:rounded-t-none overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Personnaliser</h2>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10">
              {/* Item Info */}
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-[0.2em] rounded-md">{category}</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-slate-900 mb-3">{item.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {item.description || (category === 'pizza' ? "Une délicieuse pizza artisanale, cuite lentement au feu de bois pour un goût authentique et une pâte croustillante." : category === 'burger' ? "Un burger gourmet généreux, avec des produits frais et une viande de qualité, servi avec nos frites maison." : "Une spécialité préparée avec le plus grand soin par nos artisans pour un moment de plaisir unique.")}
                  </p>
                </div>
              </div>

              {/* Size Selection if applicable */}
              {typeof item.price !== 'number' && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Choisir la taille</h4>
                  <div className="flex gap-3">
                    {'standard' in item.price ? (
                      <>
                        <button 
                          onClick={() => handleVariantChange('Standard', (item.price as any).standard)}
                          className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold ${selectedVariant === 'Standard' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
                        >
                          Standard
                        </button>
                        <button 
                          onClick={() => handleVariantChange('Large', (item.price as any).large)}
                          className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold ${selectedVariant === 'Large' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
                        >
                          Large
                        </button>
                      </>
                    ) : (
                      (['s', 'm', 'l'] as const).map(size => (
                        <button 
                          key={size}
                          onClick={() => handleVariantChange(size.toUpperCase(), (item.price as any)[size])}
                          className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold uppercase ${selectedVariant === size.toUpperCase() ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
                        >
                          {size}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Menu or Solo - Only for main dishes */}
              {['pizza', 'burger', 'tacos', 'texmex'].includes(category || '') && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Formule</h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsMenu(false)}
                      className={`flex-1 py-4 rounded-2xl border-2 transition-all text-left px-4 ${!isMenu ? 'border-red-600 bg-red-50' : 'border-slate-100'}`}
                    >
                      <span className={`block font-bold ${!isMenu ? 'text-red-600' : 'text-slate-800'}`}>Seul</span>
                      <span className="text-[10px] text-slate-400">Le produit uniquement</span>
                    </button>
                    <button 
                      onClick={() => setIsMenu(true)}
                      className={`flex-1 py-4 rounded-2xl border-2 transition-all text-left px-4 ${isMenu ? 'border-red-600 bg-red-50' : 'border-slate-100'}`}
                    >
                      <span className={`block font-bold ${isMenu ? 'text-red-600' : 'text-slate-800'}`}>Menu (+250 DA)</span>
                      <span className="text-[10px] text-slate-400">Frites + Boisson 33cl</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sauce Selection - Only for main dishes */}
              {['pizza', 'burger', 'tacos', 'texmex'].includes(category || '') && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Choisir une sauce</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {SAUCES.map(sauce => (
                      <button 
                         key={sauce}
                         onClick={() => setSelectedSauce(sauce)}
                         className={`py-3 px-4 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center justify-between ${selectedSauce === sauce ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-600'}`}
                      >
                         {sauce}
                         {selectedSauce === sauce && <div className="w-2 h-2 rounded-full bg-red-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Supplements Selection - Only for burgers, tacos, etc. */}
              {['burger', 'tacos', 'texmex'].includes(category || '') && (
                <div className="space-y-3 pb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Suppléments</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {SUPPLEMENTS
                      .filter(s => s.name !== 'Menu Frites + Boisson')
                      .filter(s => {
                        if (category === 'tacos') return true;
                        if (s.name === 'Gratinage Tacos') return false;
                        return true;
                      })
                      .map(sup => (
                      <button 
                        key={sup.name}
                        onClick={() => toggleSupplement(sup.name)}
                        className={`py-4 px-5 rounded-2xl border-2 text-sm font-bold transition-all text-left flex items-center justify-between ${selectedSupplements.includes(sup.name) ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-600'}`}
                      >
                        <div className="flex flex-col">
                          <span>{sup.name}</span>
                          {sup.price > 0 && <span className="text-[10px] text-slate-500 font-medium">+ {sup.price} DA</span>}
                        </div>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedSupplements.includes(sup.name) ? 'bg-red-600 border-red-600' : 'border-slate-200'}`}>
                           {selectedSupplements.includes(sup.name) && <Plus className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-center">
                    <button 
                      onClick={() => onConfirm(selectedSauce, isMenu, selectedVariant, currentPrice, selectedSupplements)}
                      className="w-full md:w-auto md:min-w-[280px] py-4 px-10 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      Ajouter au panier • {finalPrice} DA
                    </button>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CheckoutStep = ({ 
  userInfo, 
  setUserInfo, 
  onBack, 
  onConfirm 
}: { 
  userInfo: UserInfo, 
  setUserInfo: (u: UserInfo) => void, 
  onBack: () => void, 
  onConfirm: () => void 
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const newErrors = [];
    if (!userInfo.name) newErrors.push('Nom requis');
    if (!userInfo.phone) newErrors.push('Téléphone requis');
    if (userInfo.method === 'delivery' && !userInfo.address) newErrors.push('Adresse requise pour la livraison');
    if (!userInfo.timeslot) newErrors.push('Créneau horaire requis');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h3 className="text-xl font-bold text-slate-800">Finaliser la commande</h3>
      </div>

      <div className="space-y-6">
        {/* Method */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mode de retrait</h4>
          <div className="flex gap-3">
            <button 
              onClick={() => setUserInfo({ ...userInfo, method: 'delivery' })}
              className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${userInfo.method === 'delivery' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
            >
              <Send className="w-5 h-5" />
              <span className="text-xs font-bold">Livraison</span>
            </button>
            <button 
              onClick={() => setUserInfo({ ...userInfo, method: 'pickup' })}
              className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${userInfo.method === 'pickup' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-bold">À emporter</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vos Informations</h4>
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Nom et Prénom"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-sm"
            />
            <input 
              type="tel" 
              placeholder="Numéro de Téléphone"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-sm"
            />
            {userInfo.method === 'delivery' && (
              <textarea 
                placeholder="Adresse complète (Quartier, Immeuble, Appt...)"
                rows={2}
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-sm scrollbar-hide"
              />
            )}
          </div>
        </div>

        {/* Timeslot */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Créneau Souhaité</h4>
          <div className="relative">
            <select 
              value={userInfo.timeslot}
              onChange={(e) => setUserInfo({ ...userInfo, timeslot: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-sm appearance-none"
            >
              <option value="">Sélectionnez un créneau</option>
              <option value="Dès que possible">Dès que possible</option>
              <option value="12:00 - 12:30">12:00 - 12:30</option>
              <option value="12:30 - 13:00">12:30 - 13:00</option>
              <option value="13:00 - 13:30">13:00 - 13:30</option>
              <option value="13:30 - 14:00">13:30 - 14:00</option>
              <option value="18:30 - 19:00">18:30 - 19:00</option>
              <option value="19:00 - 19:30">19:00 - 19:30</option>
              <option value="19:30 - 20:00">19:30 - 20:00</option>
              <option value="20:00 - 20:30">20:00 - 20:30</option>
              <option value="20:30 - 21:00">20:30 - 21:00</option>
              <option value="21:00 - 21:30">21:00 - 21:30</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paiement</h4>
          <div className="flex gap-3">
            <button 
              onClick={() => setUserInfo({ ...userInfo, payment: 'cash' })}
              className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${userInfo.payment === 'cash' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
            >
              Espèces
            </button>
            <button 
              onClick={() => setUserInfo({ ...userInfo, payment: 'card' })}
              className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${userInfo.payment === 'card' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
            >
              Carte (CIB/Edahabia)
            </button>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
            {errors.map((err, i) => (
              <p key={i} className="text-[10px] text-red-600 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-600" />
                {err}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4">
          <button 
            onClick={() => {
              if (validate()) onConfirm();
            }}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Send className="w-5 h-5" />
            Confirmer la commande
          </button>
      </div>
    </div>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemove 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: CartItem[], 
  onUpdateQuantity: (id: string, delta: number) => void,
  onRemove: (id: string) => void
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ 
    name: '', 
    phone: '', 
    address: '', 
    method: 'delivery',
    timeslot: '',
    payment: 'cash'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('cart'), 300);
    }
  }, [isOpen]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSendOrder = () => {
    setIsSubmitting(true);
    
    const message = `*Nouvelle Commande - L'Artisanale*\n\n` +
      `*Client:* ${userInfo.name}\n` +
      `*Tél:* ${userInfo.phone}\n` +
      `*Mode:* ${userInfo.method === 'delivery' ? '🚗 Livraison' : '🏘️ À Emporter'}\n` +
      (userInfo.method === 'delivery' ? `*Adresse:* ${userInfo.address}\n` : '') +
      `*Créneau:* ${userInfo.timeslot}\n` +
      `*Paiement:* ${userInfo.payment === 'cash' ? '💵 Espèces' : '💳 Carte'}\n\n` +
      `*Articles:*\n` +
      cart.map(item => `- ${getFullItemName(item)} x${item.quantity} : ${item.price * item.quantity} DA`).join('\n') +
      `\n\n*TOTAL: ${total} DA*`;

    const whatsappUrl = `https://wa.me/213782777560?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsSubmitting(false);
  };

  const getFullItemName = (item: CartItem) => {
    let details = [];
    if (item.variant) details.push(item.variant);
    if (item.isMenu) details.push('MENU');
    if (item.sauce) details.push(`Sauce ${item.sauce}`);
    if (item.supplements && item.supplements.length > 0) details.push(`Suppléments: ${item.supplements.join(', ')}`);
    return `${item.name} ${details.length > 0 ? `(${details.join(', ')})` : ''}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[450px] z-50 w-full max-h-[90vh] md:max-h-full bg-white rounded-t-[32px] md:rounded-l-[32px] md:rounded-t-none overflow-hidden flex flex-col shadow-2xl"
          >
            {step === 'cart' ? (
                <>
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">Votre Panier</h2>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{cart.length} Articles</p>
                      </div>
                      <button onClick={onClose} id="close-cart" className="p-2 bg-slate-100 rounded-full text-slate-500">
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                      {cart.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center text-slate-400">
                          <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                          <p className="font-medium">Votre panier est vide</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cart.map((item) => (
                            <div key={item.cartId} className="flex gap-4 group">
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-800 leading-tight">{item.name}</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.variant && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black uppercase">{item.variant}</span>}
                                  {item.isMenu && <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-black uppercase">MENU</span>}
                                  {item.sauce && <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">Sauce: {item.sauce}</span>}
                                  {item.supplements && item.supplements.map(s => (
                                    <span key={s} className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-black uppercase">+{s}</span>
                                  ))}
                                </div>
                                <p className="text-sm font-semibold text-slate-400 mt-1">{item.price} DA / unité</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                                  <button 
                                    onClick={() => onUpdateQuantity(item.cartId, -1)}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 active:scale-95 transition-transform"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-6 text-center font-bold text-slate-800 text-sm">{item.quantity}</span>
                                  <button 
                                    onClick={() => onUpdateQuantity(item.cartId, 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 active:scale-95 transition-transform"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <button 
                                  onClick={() => onRemove(item.cartId)}
                                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500 font-medium">Sous-total</span>
                        <span className="text-2xl font-black text-slate-900">{total} DA</span>
                      </div>
                      <button 
                        disabled={cart.length === 0}
                        onClick={() => setStep('checkout')}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]
                          ${cart.length === 0 ? 'bg-slate-300 text-white' : 'bg-red-600 text-white hover:bg-red-700'}
                        `}
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Passer à la caisse
                      </button>
                    </div>
                </>
            ) : (
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                   <CheckoutStep 
                     userInfo={userInfo}
                     setUserInfo={setUserInfo}
                     onBack={() => setStep('cart')}
                     onConfirm={handleSendOrder}
                   />
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FullMenuPage = ({ onBack, onMenuClick, onAddToCart, activeCategory, setActiveCategory, onLogoClick }: { onBack: () => void, onMenuClick: () => void, onAddToCart: (item: MenuItem, cat: string, variant?: string, priceVal?: number) => void, activeCategory: string, setActiveCategory: (cat: string) => void, onLogoClick: () => void }) => {
  const [pizzaBase, setPizzaBase] = useState<'tomato' | 'cream'>('tomato');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeCategory]);

  const categories = [
    { id: 'pizza', name: 'Pizzas', menu: PIZZA_MENU, icon: <UtensilsCrossed className="w-4 h-4 md:w-5 md:h-5" />, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
    { id: 'burger', name: 'Burgers', menu: BURGER_MENU, icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-orange-400" />, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
    { id: 'tacos', name: 'Tacos', menu: TACOS_MENU, icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-sm bg-yellow-400" />, image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=800&auto=format&fit=crop' },
    { id: 'texmex', name: 'Tex-Mex', menu: TEXMEX_MENU, icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-400" />, image: 'https://images.unsplash.com/photo-1534352956279-b4230ad3ca31?q=80&w=800&auto=format&fit=crop' },
    { id: 'drinks', name: 'Boissons', menu: DRINKS, icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-400" />, image: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=800&auto=format&fit=crop' },
    { id: 'desserts', name: 'Desserts', menu: DESSERT_MENU, icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-pink-400" />, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop' },
  ];

  const filteredPizzaMenu = useMemo(() => {
    return PIZZA_MENU.filter(p => !p.base || p.base === pizzaBase);
  }, [pizzaBase]);

  const filteredItems = useMemo(() => {
    let items = activeCategory === 'pizza' ? filteredPizzaMenu : categories.find(c => c.id === activeCategory)?.menu || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return items;
  }, [activeCategory, filteredPizzaMenu, categories, searchQuery]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onBack={onBack} onMenuClick={onMenuClick} onLogoClick={onLogoClick} title="La Carte" />
      
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row bg-white">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 border-r border-slate-100 p-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Catégories</h2>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm
                    ${activeCategory === cat.id 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-100' 
                      : 'text-slate-500 hover:bg-slate-50'}
                  `}
                >
                  <span className={activeCategory === cat.id ? 'text-white' : 'text-slate-300'}>
                    {cat.icon}
                  </span>
                  {cat.id === 'texmex' ? 'Tex-Mex' : cat.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-50">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Besoin d'aide ?</p>
              <a href="tel:0782777560" className="text-xs font-bold text-slate-900 hover:text-red-600 transition-colors">07 82 77 75 60</a>
            </div>
          </div>
        </aside>

        {/* Mobile Sub-Header & Tabs */}
        <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="px-4 py-4">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Chercher un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2
                    ${activeCategory === cat.id 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                      : 'bg-white border border-slate-100 text-slate-500'}
                  `}
                >
                  <span className={activeCategory === cat.id ? 'text-white' : 'text-slate-600'}>
                    {cat.icon}
                  </span>
                  {cat.id === 'texmex' ? 'Tex-Mex' : `${cat.name}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 pb-10">
          {/* Category Hero Image */}
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-48 md:h-64 rounded-[32px] md:rounded-[48px] overflow-hidden mb-6 md:mb-12 shadow-xl"
          >
            <img 
              src={categories.find(c => c.id === activeCategory)?.image} 
              alt={categories.find(c => c.id === activeCategory)?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-10">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
                {categories.find(c => c.id === activeCategory)?.name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-red-600 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">L'Artisanale</span>
              </div>
            </div>
          </motion.div>
 
          {/* Section Header */}
          <div className={`${activeCategory === 'pizza' ? 'mb-8 md:mb-12' : 'hidden md:flex md:mb-12'} flex flex-col md:flex-row md:items-end justify-between gap-6`}>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-red-600 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Sélection du jour</span>
              </div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Découvrez nos saveurs authentiques
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              {/* Desktop Search */}
              <div className="hidden md:relative md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-bold min-w-[240px] focus:outline-none focus:ring-2 focus:ring-red-600/10 transition-all"
                />
              </div>

              {activeCategory === 'pizza' && (
                <div className="bg-slate-50 p-1 rounded-2xl flex border border-slate-100 min-w-0">
                  <button 
                    onClick={() => setPizzaBase('tomato')}
                    className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pizzaBase === 'tomato' ? 'bg-white shadow-md text-red-600' : 'text-slate-500'}`}
                  >
                    Tomate
                  </button>
                  <button 
                    onClick={() => setPizzaBase('cream')}
                    className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pizzaBase === 'cream' ? 'bg-white shadow-md text-red-600' : 'text-slate-500'}`}
                  >
                    Crème
                  </button>
                </div>
              )}
            </div>
          </div>

          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col divide-y divide-slate-100"
          >
            {filteredItems.map((item) => (
              <MenuListItem 
                key={`${activeCategory}-${item.name}`} 
                item={item} 
                category={activeCategory} 
                onAddToCart={(v, p) => onAddToCart(item, activeCategory, v, p)} 
              />
            ))}
            {filteredItems.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-bold">Aucun résultat trouvé.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};


export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/carte' ? 'full_menu' : 'home';
    }
    return 'home';
  });
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('pizza');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [customizingCategory, setCustomizingCategory] = useState<string | undefined>();
  const [initialVariant, setInitialVariant] = useState<string | undefined>();
  const [initialPrice, setInitialPrice] = useState<number | undefined>();

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/carte') {
        setCurrentPage('full_menu');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const navigateTo = (page: Page, category?: string) => {
    const url = page === 'home' ? '/' : '/carte';
    if (window.location.pathname !== url) {
      window.history.pushState({ page, category }, '', url);
    }
    
    if (category) {
      setActiveMenuCategory(category);
    }
    setCurrentPage(page);
    setIsNavOpen(false);
  };

  const startCustomization = (item: MenuItem, category: string, variant?: string, priceVal?: number) => {
    setCustomizingItem(item);
    setCustomizingCategory(category);
    setInitialVariant(variant);
    setInitialPrice(priceVal);
  };

  const confirmAddToCart = (sauce?: string, isMenu?: boolean, variant?: string, price?: number, supplements?: string[]) => {
    if (!customizingItem) return;
    
    const supplementsPrice = supplements?.reduce((acc, name) => {
      const supplement = SUPPLEMENTS.find(s => s.name === name);
      return acc + (supplement?.price || 0);
    }, 0) || 0;

    const finalPrice = (isMenu ? (price || 0) + 250 : (price || 0)) + supplementsPrice;
    
    // Sort supplements to ensure consistent cartId
    const sortedSups = supplements ? [...supplements].sort().join(',') : 'none';
    const cartId = `${customizingItem.name}-${variant || 'default'}-${sauce || 'nosauce'}-${isMenu ? 'menu' : 'solo'}-${sortedSups}`;

    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) {
        return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        cartId, 
        name: customizingItem.name, 
        price: finalPrice, 
        quantity: 1, 
        variant, 
        sauce, 
        isMenu,
        supplements
      }];
    });

    setCustomizingItem(null);
    setInitialVariant(undefined);
    setInitialPrice(undefined);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.cartId !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div id="app-root" className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onNavigate={navigateTo} onMenuClick={toggleNav} hasCart={cartCount > 0} />
          </motion.div>
        ) : (
          <motion.div 
            key="full_menu_view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FullMenuPage 
              onBack={() => navigateTo('home')} 
              onMenuClick={toggleNav}
              onAddToCart={startCustomization}
              activeCategory={currentPage === 'full_menu' ? activeMenuCategory : currentPage}
              setActiveCategory={(cat) => {
                setActiveMenuCategory(cat);
                setCurrentPage('full_menu');
                // Optional: update URL with category if desired, e.g. history.replaceState
              }}
              onLogoClick={() => navigateTo('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationDrawer 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)} 
        onNavigate={navigateTo} 
      />

      <CustomizationModal 
        isOpen={!!customizingItem}
        item={customizingItem}
        category={customizingCategory}
        onClose={() => { setCustomizingItem(null); setCustomizingCategory(undefined); }}
        onConfirm={confirmAddToCart}
        initialVariant={initialVariant}
        initialPrice={initialPrice}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      />

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-8 right-6 lg:bottom-10 lg:right-10 z-40"
        >
          <button 
            id="floating-cart"
            onClick={() => setIsCartOpen(true)}
            className="bg-red-600 text-white rounded-full p-5 lg:p-6 flex items-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
          >
            <div className="relative">
                <ShoppingBag className="w-7 h-7 lg:w-8 lg:h-8" />
                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-50">
                    {cartCount}
                </span>
            </div>
          </button>
        </motion.div>
      )}
    </div>
  );
}
