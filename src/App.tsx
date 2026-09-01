/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, ReactNode, FormEvent, Fragment } from 'react';
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
  ArrowRight,
  Search,
  Plus,
  Minus,
  Trash2,
  Send,
  MessageCircle,
  Home,
  Navigation,
  Star,
  LayoutGrid,
  Quote,
  Heart,
  Share2,
  Bike,
  Footprints,
  Percent,
  Crown,
  Sparkles,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

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
  category: string;
  price: number;
  quantity: number;
  variant?: string;
  sauce?: string;
  sauces?: string[];
  crudites?: string[];
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
        <div 
            className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full min-h-[237px] md:min-h-[269px]"
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
        </div>
    );
};

// --- Data ---
const PIZZA_MENU: MenuItem[] = [
  // Base Tomate
  { name: 'Marguerita', price: { standard: 450, large: 800 }, description: 'Sauce tomate, fromage, mozzarella, basilic frais, olives.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Thon', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, thon, oignons, olives.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Poulet', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, poulet mariné, poivrons, olives.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Viande Hachée', price: { standard: 650, large: 1200 }, description: 'Sauce tomate, fromage, viande hachée fraîche, olives.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Vegie', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, poivrons, oignons, tomate, aubergines, olives.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Oriental', price: { standard: 650, large: 1200 }, description: 'Sauce tomate, fromage, merguez, poivrons grillés, olives.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'BBQ', price: { standard: 700, large: 1300 }, description: 'Sauce tomate, fromage, viande hachée, oeuf, poivrons, olives, sauce BBQ.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: '3 Fromages', price: { standard: 750, large: 1400 }, description: 'Sauce tomate, mozzarella, gruyère, boursin, olives.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: "L'Artisanale", price: { standard: 900, large: 1700 }, description: 'Sauce tomate ou crème, viande hachée, poulet fumé, boursin, olives.', base: 'tomato', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  // Base Crème
  { name: 'Forestière', price: { standard: 750, large: 1400 }, description: 'Crème fraîche, fromage, poulet fumé, oignons, champignons, olives.', base: 'cream', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Tartiflette', price: { standard: 750, large: 1400 }, description: 'Crème fraîche, fromage, poulet fumé, champignons, pomme de terre, olives.', base: 'cream', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Boisée', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, poivrons, sauce fromagère.', base: 'cream', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Boursin', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, boursin, olives.', base: 'cream', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Raclette', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, raclette, pomme de terre, olives.', base: 'cream', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
  { name: 'Saumon', price: { standard: 1100, large: 2100 }, description: 'Crème fraîche, fromage, saumon fumé de qualité, oignons, boursin.', base: 'cream', image: 'https://i.ibb.co/39SCP8Ff/Margerita.webp' },
];

const BURGER_MENU: MenuItem[] = [
  { name: 'Cheese Burger', price: 300, description: 'Pain brioché, Steak pur beef, cheddar fondu, crudités.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_37_uajb96' },
  { name: 'Chicken Crispy', price: 450, description: 'Pain brioché, Poulet crispy maison, sauce blanche, crudités.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_37_uajb96' },
  { name: 'Double Cheese', price: 600, description: 'Pain brioché, 2 Steaks, double cheddar, crudités.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_37_uajb96' },
  { name: 'Double Chicken Crispy', price: 650, description: 'Pain brioché, 2 Poulets crispy, sauce blanche, crudités.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_37_uajb96' },
  { name: 'Triple Cheese', price: 800, description: 'Pain brioché, 3 Steaks, 3 cheddars, crudités.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_37_uajb96' },
  { name: 'Mix Burger', price: 700, description: 'Pain brioché, Steak, poulet crispy, fromage, crudités.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_37_uajb96' },
  { name: 'Le Gourmand', price: 750, description: 'Pain brioché, Steak, dinde fumée, bacon, sauce BBQ, crudités.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_37_uajb96' },
];

const TACOS_MENU: MenuItem[] = [
  { name: 'Classique', price: { standard: 600, large: 950 }, description: 'Viande ou escalope, fromagère, frites, sauce au choix.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_39_lbayao' },
  { name: 'Raclette', price: { standard: 800, large: 1150 }, description: 'Viande hachée, fromage raclette, sauce fromagère, frites.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_39_lbayao' },
  { name: 'Boursin', price: { standard: 700, large: 1050 }, description: 'Escalope, boursin, crème fraîche, frites, sauce au choix.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_39_lbayao' },
  { name: 'Crousty', price: { standard: 750, large: 1100 }, description: 'Tenders crispy, boursin, fromagère, frites.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_39_lbayao' },
  { name: 'Forestier', price: { standard: 850, large: 1200 }, description: 'Escalope, oignons, champignons, dinde fumée, fromagère, frites.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_39_lbayao' },
  { name: 'Chicken Beef', price: { standard: 900, large: 1350 }, description: 'Viandehachée, tenders, fromagère, raclette, frites.', image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_39_lbayao' },
];

const TEXMEX_MENU: MenuItem[] = [
  { name: 'CHICKEN PARTY medium', price: 2000, description: '5 WINGS • 5 TENDERS • 7 NUGGETS • 2 FRITES • 1 BOUTEILLE 1L', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600' },
  { name: 'CHICKEN PARTY xxl', price: 3500, description: '10 WINGS • 10 TENDERS • 14 NUGGETS • 4 FRITES • 1 BOUTEILLE 1L', image: 'https://images.unsplash.com/photo-1541510912111-eec32b260b17?auto=format&fit=crop&q=80&w=600' },
  { name: 'Wrap Poulet', price: 550, description: 'Poulet mariné, crudités, sauce blanche.', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=600' },
  { name: 'Croque-Monsieur', price: 250, description: 'Pain de mie, dinde fumée, fromage.', image: 'https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?auto=format&fit=crop&q=80&w=600' },
  { name: 'Barquette Frites x3', price: 300, image: 'https://images.unsplash.com/photo-1573088693246-9b4a92c4cd41?auto=format&fit=crop&q=80&w=600' },
  { name: 'Barquette Frites x5', price: 500, image: 'https://images.unsplash.com/photo-1518013391915-e443914046cd?auto=format&fit=crop&q=80&w=600' },
  { name: 'Barquette Frites x7', price: 600, image: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?auto=format&fit=crop&q=80&w=600' },
];

const SUPPLEMENTS = [
  { name: 'Oignons Caramélisés', price: 0 },
  { name: 'Cornichons', price: 0 },
  { name: 'Oeuf / Slice Cheese', price: 50 },
  { name: 'Viande', price: 50 },
  { name: 'Dinde Fumée', price: 250 },
  { name: 'Menu Frites + Boisson', price: 200 },
  { name: 'Gratinage Tacos', price: 150 },
];

const DESSERT_MENU: MenuItem[] = [
  { name: 'Tiramisu Maison', price: 450, description: 'Tiramisu traditionnel italien.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600' },
  { name: 'Mousse au Chocolat', price: 350, description: 'Chocolat noir onctueux.', image: 'https://images.unsplash.com/photo-1541783245831-57d69a4d5302?auto=format&fit=crop&q=80&w=600' },
  { name: 'Panacotta Fruits Rouges', price: 400, description: 'Panacotta nappée de coulis.', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600' },
  { name: 'Cheesecake Citron', price: 500, description: 'Cheesecake frais au citron.', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600' },
];

const DRINKS = [
  { name: 'Eau 33cl', price: 30, image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_38_qzf9uk' },
  { name: 'Eau gazeuse 33cl', price: 50, image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_38_qzf9uk' },
  { name: 'Jus 33cl', price: 100, image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_38_qzf9uk' },
  { name: 'Canette 33cl', price: 100, image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_38_qzf9uk' },
  { name: 'Boisson gazeuse 1L', price: 150, image: 'https://res.cloudinary.com/dopnnowvl/image/upload/f_auto,q_auto/Image_38_qzf9uk' },
];

const CATEGORIES = [
  {
    id: 'all',
    name: 'Voir tout',
    subtitle: 'La Carte Complète',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070',
    icon: <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />,
    hideInBento: true,
    menu: [] // Will be merged in useMemo
  },
  { 
    id: 'pizza', 
    name: 'Pizzas', 
    subtitle: 'Au Feu de Bois', 
    menu: PIZZA_MENU, 
    icon: <span className="text-sm md:text-lg">🍕</span>, 
    image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg',
    bentoSpan: 'md:col-span-8'
  },
  { 
    id: 'burger', 
    name: 'Burgers', 
    subtitle: 'Gourmet', 
    menu: BURGER_MENU, 
    icon: <span className="text-sm md:text-lg">🍔</span>, 
    image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg',
    bentoSpan: 'md:col-span-4'
  },
  { 
    id: 'tacos', 
    name: 'Tacos', 
    subtitle: "Sauce Fromagère Incluse", 
    menu: TACOS_MENU, 
    icon: <span className="text-sm md:text-lg">🌮</span>, 
    image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png',
    bentoSpan: 'md:col-span-4'
  },
  { 
    id: 'texmex', 
    name: 'Tex-Mex', 
    subtitle: 'Délices Mix', 
    menu: TEXMEX_MENU, 
    icon: <span className="text-sm md:text-lg">🍗</span>, 
    image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg',
    bentoSpan: 'md:col-span-8'
  },
  { 
    id: 'drinks', 
    name: 'Boissons', 
    subtitle: 'Fraîcheur', 
    menu: DRINKS, 
    icon: <span className="text-sm md:text-lg">🥤</span>, 
    image: 'https://www.pequerecetas.com/wp-content/uploads/2013/04/refrescos-para-ninos.jpg',
    bentoSpan: 'hidden'
  },
  { 
    id: 'desserts', 
    name: 'Desserts', 
    subtitle: 'Douceurs', 
    menu: DESSERT_MENU, 
    icon: <span className="text-sm md:text-lg">🍰</span>, 
    image: 'https://www.macphie.com/app/uploads/2024/09/Tiramisu-Mactop-traditional-1920px-1280x896.jpg',
    bentoSpan: 'hidden'
  },
];

const CRUDITES = [
  'Salade', 'Tomate', 'Oignons'
];

const SAUCES = [
  'Ketchup', 'Mayonnaise', 'Moutarde', 'Harissa', 'Burger', 'Algérienne', 'Barbecue', 'Brazil', 'Samourai'
];

const GALLERY_IMAGES = [
  { url: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg', title: 'Pizza Artisanale' },
  { url: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg', title: 'Burger Gourmet' },
  { url: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg', title: 'Tex-Mex Délices' },
  { url: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png', title: 'Tacos Authentique' },
  { url: 'https://www.macphie.com/app/uploads/2024/09/Tiramisu-Mactop-traditional-1920px-1280x896.jpg', title: 'Desserts Maison' },
  { url: 'https://www.pequerecetas.com/wp-content/uploads/2013/04/refrescos-para-ninos.jpg', title: 'Boissons Fraîches' },
];

const REVIEWS = [
  {
    name: "Sami B.",
    text: "La meilleure pizza au feu de bois de Draria. Pâte fine et croustillante, ingrédients frais. Un vrai régal !",
    initials: "SB",
    rating: 5,
    date: "Il y a 2 jours",
    tags: ["Pizza", "Authentique"]
  },
  {
    name: "Lina M.",
    text: "Le burger smash est incroyable ! Le service est rapide et l'équipe est aux petits soins.",
    initials: "LM",
    rating: 5,
    date: "Il y a 1 semaine",
    tags: ["Burger", "Service"]
  },
  {
    name: "Karim T.",
    text: "Tacos bien garnis et sauce fromagère maison délicieuse. Je recommande vivement !",
    initials: "KT",
    rating: 4,
    date: "Il y a 2 semaines",
    tags: ["Tacos", "Généreux"]
  }
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

  // Samedi(6)-Lundi(1)-Mardi(2)-Mercredi(3)-Jeudi(4): 11h30-15h30 / 18h-00h
  // Vendredi(5): 18h00-00h
  // Dimanche(0): Fermé

  if (day === 0) return false;

  const isLunch = timeInMinutes >= (11 * 60 + 30) && timeInMinutes <= (15 * 60 + 30);
  const isDinner = timeInMinutes >= (18 * 60) && (hours < 24); // Handles until midnight

  if (day === 5) return isDinner;
  return isLunch || isDinner;
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
    <motion.div 
      variants={itemVariants}
      className="group bg-white rounded-2xl border border-slate-100 p-2.5 sm:p-3 hover:shadow-md hover:border-red-100 transition-all flex flex-col justify-between h-full relative cursor-pointer w-full"
      onClick={() => onAddToCart()}
    >
      <div>
        {/* Product Image - Reduced height for more compact card */}
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-slate-50 border border-slate-100/80 mb-2">
          <img 
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300'} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </div>
        
        {/* Content */}
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug line-clamp-1 group-hover:text-red-600 transition-colors">
            {item.name}
          </h4>
        </div>
      </div>

      {/* Full-width add button with centered price */}
      <div className="mt-2 pt-2 border-t border-slate-100/80">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-full h-8 sm:h-9 px-3 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-xs hover:bg-red-600 active:scale-[0.98] transition-all cursor-pointer"
          aria-label={`Ajouter au panier - ${startingPrice} DA`}
        >
          <span className="text-[11px] sm:text-xs font-semibold tracking-tight text-white">
            {startingPrice} DA
          </span>
        </button>
      </div>
    </motion.div>
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

const Header = ({ onMenuClick, onBack, onLogoClick, onOrderClick, onCallClick, title, useImageLogo, isSmallLogo }: { 
    onMenuClick?: () => void, 
    onBack?: () => void, 
    onLogoClick?: () => void,
    onOrderClick?: () => void,
    onCallClick?: () => void,
    title?: string,
    useImageLogo?: boolean,
    isSmallLogo?: boolean
}) => (
  <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16 flex items-center">
    <div className="w-full max-w-md mx-auto px-4 flex items-center justify-between relative">
        <button onClick={onLogoClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {useImageLogo ? (
                <img 
                    src="https://scontent.falg7-6.fna.fbcdn.net/v/t39.30808-6/298339068_379924957653168_8646108471508860568_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=EwO7uVSm4CwQ7kNvwFCdIlg&_nc_oc=AdoFYx3L6RqcvVlxaLIILY8TDP-hWAw5rL-YhnuEoVEDRbtv7jPoCzqNyC5pYixYoHI&_nc_zt=23&_nc_ht=scontent.falg7-6.fna&_nc_gid=5Ir_kphaLNa1qX73hPu7mg&_nc_ss=7b289&oh=00_Af4A-933NTSqmoYI4qic2lXzxKKAlxoMxCOyqmvK1XtZ0Q&oe=69FF6900" 
                    alt="L'Artisanale Logo" 
                    className="w-11 h-11 object-cover rounded-xl shadow-sm border border-slate-100"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <>
                    <UtensilsCrossed className="w-6 h-6 text-red-600" />
                    <span className="font-bold tracking-tight text-lg">L'Artisanale</span>
                </>
            )}
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2">
          {title && <h1 className="font-bold text-slate-900 text-base whitespace-nowrap">{title}</h1>}
        </div>
 
        <div className="flex items-center gap-2">
            {onBack && (
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold border border-slate-100"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                </button>
            )}
            {onCallClick && (
              <a 
                href="tel:0782777560" 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 active:scale-95 transition-all border border-slate-100"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            {onMenuClick && (
              <button 
                  onClick={() => onMenuClick()} 
                  id="header-menu" 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 hover:bg-slate-100 active:scale-95 transition-all border border-slate-100"
              >
                  <MenuIcon className="w-5 h-5 text-slate-800" />
              </button>
            )}
        </div>
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
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className="fixed inset-0 z-[60] bg-white flex flex-col h-full overflow-hidden max-w-md mx-auto shadow-2xl"
        >
          {/* Header inside drawer */}
          <div className="flex justify-start items-center px-4 py-5 w-full">
            <button 
              onClick={onClose} 
              id="close-drawer" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90 border border-slate-100 cursor-pointer"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 flex flex-col justify-center px-6 w-full">
            <nav className="flex flex-col gap-4">
              {[
                { label: 'Accueil', action: () => onNavigate('home') },
                { label: 'La Carte', action: () => onNavigate('full_menu') },
                { label: 'Adresse', href: 'https://maps.app.goo.gl/ooZi92NoWhsah1iX6' },
                { label: 'Livraison', href: 'tel:0782777560' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >
                  {item.action ? (
                    <button 
                      onClick={() => { item.action(); onClose(); }}
                      className="group py-3 text-center w-full border-b border-slate-100 hover:border-red-100 transition-all"
                    >
                      <span className="text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-all duration-300">
                        {item.label}
                      </span>
                    </button>
                  ) : (
                    <a 
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="group py-3 text-center block w-full border-b border-slate-100 hover:border-red-100 transition-all"
                    >
                      <span className="text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-all duration-300">
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
              transition={{ delay: 0.35 }}
              className="mt-8 pt-6 border-t border-slate-100 flex justify-center items-center gap-6"
            >
              {[
                { icon: Instagram, href: "https://www.instagram.com/lartisanale_draria/" },
                { icon: Music, href: "https://tiktok.com" },
                { icon: Facebook, href: "https://www.facebook.com/lartisanaledraria/?locale=fr_FR" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-100"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
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

const HomePage = ({ 
  onNavigate, 
  onMenuClick, 
  hasCart,
  onAddToCart,
  activeCategory,
  setActiveCategory
}: { 
  onNavigate: (p: Page, cat?: string) => void, 
  onMenuClick: () => void, 
  hasCart: boolean,
  onAddToCart: (item: MenuItem, cat: string, variant?: string, priceVal?: number) => void,
  activeCategory: string,
  setActiveCategory: (cat: string) => void
}) => {
  const isOpen = checkIsOpen();
  const [isLiked, setIsLiked] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'takeaway'>('delivery');
  const [shareCopied, setShareCopied] = useState(false);

  const isManualScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<any>(null);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "L'Artisanale Maison",
        text: "Découvrez le menu de L'Artisanale Maison !",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const MENU_SECTIONS = useMemo(() => [
    { id: 'pizza', name: 'Pizzas', subtitle: 'Au Feu de Bois', icon: <span className="text-base">🍕</span>, items: PIZZA_MENU },
    { id: 'burger', name: 'Burgers', subtitle: 'Gourmet', icon: <span className="text-base">🍔</span>, items: BURGER_MENU },
    { id: 'tacos', name: 'Tacos', subtitle: 'Sauce Fromagère Incluse', icon: <span className="text-base">🌮</span>, items: TACOS_MENU },
    { id: 'texmex', name: 'Tex-Mex', subtitle: 'Délices Mix', icon: <span className="text-base">🍗</span>, items: TEXMEX_MENU },
    { id: 'drinks', name: 'Boissons', subtitle: 'Fraîcheur', icon: <span className="text-base">🥤</span>, items: DRINKS },
    { id: 'desserts', name: 'Desserts', subtitle: 'Douceurs', icon: <span className="text-base">🍰</span>, items: DESSERT_MENU },
  ], []);

  const TAB_ITEMS = useMemo(() => [
    { id: 'all', label: 'Tout' },
    { id: 'pizza', label: 'Pizzas' },
    { id: 'burger', label: 'Burgers' },
    { id: 'tacos', label: 'Tacos' },
    { id: 'texmex', label: 'Tex-Mex' },
    { id: 'drinks', label: 'Boissons' },
    { id: 'desserts', label: 'Desserts' },
  ], []);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    isManualScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (catId === 'all') {
      const el = document.getElementById('menu-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      const el = document.getElementById(`section-${catId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 850);
  };

  const scrollToMenu = (catId?: string) => {
    if (catId) {
      handleCategoryClick(catId);
    } else {
      handleCategoryClick('all');
    }
  };

  // Scroll-spy: Sync active category tab when scrolling naturally
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrollingRef.current) return;
      
      const sections = MENU_SECTIONS.map(s => document.getElementById(`section-${s.id}`)).filter(Boolean) as HTMLElement[];
      const scrollPosition = window.scrollY + 160;

      const menuSection = document.getElementById('menu-section');
      if (menuSection && window.scrollY < (menuSection.offsetTop - 80)) {
        setActiveCategory('all');
        return;
      }

      let currentCat = 'all';
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          currentCat = section.id.replace('section-', '');
        }
      }
      setActiveCategory(currentCat);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [MENU_SECTIONS, setActiveCategory]);

  // Keep active tab centered in horizontal tabs bar
  useEffect(() => {
    const tabBtn = document.getElementById(`tab-${activeCategory}`);
    if (tabBtn) {
      tabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 w-full flex flex-col items-center">
        {/* New Delivery-App Style Hero Banner */}
        <section className="relative w-full max-w-md mx-auto">
          {/* Top Banner Image */}
          <div className="relative w-full h-52 sm:h-56 bg-slate-900 overflow-hidden">
            <img 
               src="https://i.ibb.co/jkK7n323/HP-Hero-XS-Hut-Summer-0726-1.jpg" 
               alt="L'Artisanale Banner" 
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
            />
            {/* Dark gradient for text & button legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

            {/* Top Floating Action Buttons */}
            <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-20">
              <button 
                onClick={onMenuClick}
                aria-label="Menu"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 active:scale-95 transition-all shadow-md cursor-pointer hover:bg-white/30"
              >
                <MenuIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  aria-label="Favori"
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 active:scale-95 transition-all shadow-md cursor-pointer hover:bg-white/30"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>

                <button 
                  onClick={handleShare}
                  aria-label="Partager"
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 active:scale-95 transition-all shadow-md cursor-pointer hover:bg-white/30 relative"
                >
                  <Share2 className="w-5 h-5 text-white" />
                  {shareCopied && (
                    <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Lien copié !
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Restaurant Card Body Overlapping the Banner */}
          <div className="relative px-4 pb-2">
            {/* Center Logo Badge */}
            <div className="relative -mt-11 z-20 flex justify-center">
              <div className="w-22 h-22 rounded-full border-4 border-white shadow-xl overflow-hidden bg-red-600 flex items-center justify-center">
                <img 
                  src="https://scontent.falg7-6.fna.fbcdn.net/v/t39.30808-6/298339068_379924957653168_8646108471508860568_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=EwO7uVSm4CwQ7kNvwFCdIlg&_nc_oc=AdoFYx3L6RqcvVlxaLIILY8TDP-hWAw5rL-YhnuEoVEDRbtv7jPoCzqNyC5pYixYoHI&_nc_zt=23&_nc_ht=scontent.falg7-6.fna&_nc_gid=5Ir_kphaLNa1qX73hPu7mg&_nc_ss=7b289&oh=00_Af4A-933NTSqmoYI4qic2lXzxKKAlxoMxCOyqmvK1XtZ0Q&oe=69FF6900" 
                  alt="L'Artisanale Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Restaurant Title & Info */}
            <div className="text-center mt-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                L'Artisanale Maison
              </h1>
              
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-1 font-medium flex-wrap">
                <span className="flex items-center text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  4.8
                </span>
                <span className="text-slate-400 font-normal">(1 652)</span>
                <span className="text-slate-300">•</span>
                <span className="text-red-500 font-medium">FoodyPro+</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-normal">0.1 km</span>
              </div>
            </div>

            {/* Delivery / Takeaway Switcher Pill */}
            <div className="mt-4 flex justify-center">
              <div className="bg-slate-50 border border-slate-200/80 rounded-full p-1.5 pl-1.5 pr-4 flex items-center gap-3 shadow-xs">
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-slate-200/60 shadow-inner shrink-0">
                  <button 
                    onClick={() => setDeliveryMode('delivery')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      deliveryMode === 'delivery' 
                        ? 'bg-[#FF5A36] text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Livraison"
                  >
                    <Bike className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeliveryMode('takeaway')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      deliveryMode === 'takeaway' 
                        ? 'bg-[#FF5A36] text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="À emporter / Sur place"
                  >
                    <Footprints className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {deliveryMode === 'delivery' ? 'Temps de livraison: 10-20 min' : 'À emporter: 10-15 min'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                    {deliveryMode === 'delivery' ? 'Frais: 3.5€ • Commande min: 27€' : 'Sans frais • Prêt en restaurant'}
                  </p>
                </div>
              </div>
            </div>

            {/* Promo & Discount Coupon Cards */}
            <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
              {/* Coupon 1: 50% Off */}
              <div className="shrink-0 w-[240px] bg-white border border-slate-200/90 rounded-2xl p-3 relative shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xs font-semibold">
                    <Percent className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-sm text-slate-800">50% de réduction</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug font-normal">
                  Commande minimum 20€. Valable sur tous les articles. Appliqué auto.
                </p>
              </div>

              {/* Coupon 2: 30% Off */}
              <div className="shrink-0 w-[240px] bg-white border border-slate-200/90 rounded-2xl p-3 relative shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-semibold">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-sm text-slate-800">30% de réduction</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug font-normal">
                  Commande minimum 15€. Valable sur les menus. Appliqué auto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Native App Continuous Menu Integration --- */}
        <section id="menu-section" className="w-full max-w-md mx-auto px-4 pt-2 pb-24 scroll-mt-16">
          {/* Category Filter Tabs Bar (Sticky Native App Style) */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-2 pb-0 mb-5 border-b border-slate-200 -mx-4 px-4 shadow-xs">
            <div className="max-w-md mx-auto flex overflow-x-auto no-scrollbar gap-6 justify-start items-center">
              {TAB_ITEMS.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button 
                    key={cat.id}
                    id={`tab-${cat.id}`}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`relative pb-3 text-sm transition-colors whitespace-nowrap cursor-pointer shrink-0
                      ${isSelected 
                        ? 'text-slate-900 font-semibold' 
                        : 'text-slate-400 hover:text-slate-600 font-normal'}
                    `}
                  >
                    <span>{cat.label}</span>
                    {isSelected && (
                      <motion.div 
                        layoutId="activeCategoryTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-900 rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continuous Category Sections */}
          <div className="space-y-8">
            {MENU_SECTIONS.map((section) => (
              <div 
                key={section.id} 
                id={`section-${section.id}`} 
                className="scroll-mt-14 pt-2"
              >
                {/* Section Header */}
                <div className="pb-2.5 mb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="bg-red-50 w-8 h-8 rounded-xl text-red-600 shadow-xs flex items-center justify-center shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 capitalize tracking-tight">
                      {section.name}
                    </h3>
                    <p className="text-[10px] font-normal text-slate-400 uppercase tracking-wider">{section.subtitle}</p>
                  </div>
                </div>

                {/* 2-Column Product Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {section.items.map((item, idx) => (
                    <MenuListItem 
                      key={`${section.id}-${item.name}-${idx}`} 
                      item={item} 
                      category={section.id} 
                      onAddToCart={(v, p) => onAddToCart(item, section.id, v, p)} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

const MenuPage = ({ category, onBack, onMenuClick, onAddToCart }: { category: Page, onBack: () => void, onMenuClick: () => void, onAddToCart: (item: MenuItem, cat: string, variant?: string, priceVal?: number) => void }) => {
  const [activeTab, setActiveTab] = useState<'carte' | 'extras'>('carte');

  const menuItems = useMemo(() => {
    switch (category) {
      case 'pizza': return PIZZA_MENU;
      case 'burger': return BURGER_MENU;
      case 'tacos': return TACOS_MENU;
      case 'texmex': return TEXMEX_MENU;
      default: return [];
    }
  }, [category]);

  const titles = {
    pizza: 'Nos Pizzas',
    burger: 'Nos Burgers',
    tacos: 'Nos Tacos',
    texmex: 'Notre Tex-Mex',
    full_menu: 'La Carte'
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isSmallLogo={true} onBack={onBack} onCallClick={() => window.location.href = 'tel:0782777560'} title={titles[category as keyof typeof titles]} />
      
      <div className="max-w-md mx-auto w-full">
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

        <div className="w-full px-4">
          {/* Main View Toggle */}
          <div className="px-2 py-3 sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 mb-2">
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
                    {/* Menu Items List */}
                    <motion.div 
                      key={category}
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
                      className="px-4 pt-4 pb-20 grid grid-cols-2 gap-2.5 sm:gap-3"
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
  initialPrice,
  initialSauce,
  initialSauces,
  initialCrudites,
  initialIsMenu,
  initialSupplements,
  isEditing
}: { 
  item: MenuItem | null, 
  category?: string,
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (sauces?: string[], isMenu?: boolean, variant?: string, price?: number, supplements?: string[], crudites?: string[]) => void,
  initialVariant?: string,
  initialPrice?: number,
  initialSauce?: string,
  initialSauces?: string[],
  initialCrudites?: string[],
  initialIsMenu?: boolean,
  initialSupplements?: string[],
  isEditing?: boolean
}) => {
  const [selectedSauces, setSelectedSauces] = useState<string[]>(initialSauces || (initialSauce ? [initialSauce] : []));
  const [selectedCrudites, setSelectedCrudites] = useState<string[]>(initialCrudites || []);
  const [isMenu, setIsMenu] = useState(initialIsMenu || false);
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>(initialSupplements || []);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || '');
  const [currentPrice, setCurrentPrice] = useState(initialPrice || 0);

  useEffect(() => {
    if (item) {
      if (initialVariant !== undefined) {
        setSelectedVariant(initialVariant);
        setCurrentPrice(initialPrice || 0);
      } else if (typeof item.price === 'number') {
        setSelectedVariant('');
        setCurrentPrice(item.price);
      } else if ('standard' in item.price) {
        setSelectedVariant(category === 'tacos' ? 'L' : 'Standard');
        setCurrentPrice(item.price.standard);
      } else if ('s' in item.price) {
        setSelectedVariant('S');
        setCurrentPrice(item.price.s);
      }
      setSelectedSauces(category === 'pizza' ? [] : (initialSauces || (initialSauce ? [initialSauce] : [])));
      setSelectedCrudites(initialCrudites || []);
      setIsMenu(category === 'pizza' ? false : initialIsMenu || false);
      setSelectedSupplements(initialSupplements || []);
    }
  }, [item, initialVariant, initialPrice, initialSauce, initialSauces, initialCrudites, initialIsMenu, initialSupplements, category]);

  if (!item) return null;

  const handleVariantChange = (v: string, p: number) => {
    setSelectedVariant(v);
    setCurrentPrice(p);
  };

  const toggleSauce = (sauce: string) => {
    setSelectedSauces(prev => {
      if (prev.includes(sauce)) {
        return prev.filter(s => s !== sauce);
      }
      if (prev.length < 2) {
        return [...prev, sauce];
      }
      return prev;
    });
  };

  const toggleCrudite = (name: string) => {
    setSelectedCrudites(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
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
            className="fixed inset-x-0 bottom-0 z-[70] w-full max-w-[480px] mx-auto max-h-[90vh] bg-white rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Top Product Image Banner */}
            <div className="relative w-full h-44 sm:h-52 bg-slate-100 flex-shrink-0 overflow-hidden">
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'} 
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/40" />
              
              {/* Category Pill Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                  {category === 'pizza' ? '🍕 Feu de bois' : category === 'burger' ? '🍔 Burger' : category === 'tacos' ? '🌮 Tacos' : category === 'texmex' ? '🍗 Tex-Mex' : category === 'desserts' ? '🍰 Dessert' : category === 'drinks' ? '🥤 Boisson' : (category || 'Menu')}
                </span>
              </div>

              {/* Close Button Floating */}
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title on Banner Bottom */}
              <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
                <h3 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-sm">{item.name}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
              {/* Item Info */}
              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-500 leading-relaxed font-normal">
                  {item.description || (category === 'pizza' ? "Une délicieuse pizza artisanale, cuite lentement au feu de bois pour un goût authentique et une pâte croustillante." : category === 'burger' ? "Un burger gourmet généreux, avec des produits frais et une viande de qualité, servi avec nos frites maison." : "Une spécialité préparée avec le plus grand soin par nos artisans pour un moment de plaisir unique.")}
                </p>
              </div>

              {/* Size Selection if applicable */}
              {typeof item.price !== 'number' && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Choisir la taille</h4>
                  <div className="flex gap-3">
                    {'standard' in item.price ? (
                      <>
                        <button 
                          onClick={() => handleVariantChange(category === 'tacos' ? 'L' : 'Standard', (item.price as any).standard)}
                          className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold ${selectedVariant === (category === 'tacos' ? 'L' : 'Standard') ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
                        >
                          {category === 'tacos' ? 'L' : 'Standard'}
                        </button>
                        <button 
                          onClick={() => handleVariantChange(category === 'tacos' ? 'XL' : 'Grande', (item.price as any).large)}
                          className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold ${selectedVariant === (category === 'tacos' ? 'XL' : 'Grande') ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-500'}`}
                        >
                          {category === 'tacos' ? 'XL' : 'Grande'}
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
              {['burger', 'tacos', 'texmex'].includes(category || '') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Formule</h4>
                    {isMenu && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">+250 DA</span>}
                  </div>
                  <div className="relative p-1 bg-slate-100 rounded-xl flex items-center h-12 md:h-10">
                    <div 
                      className={`absolute h-10 md:h-8 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${!isMenu ? 'translate-x-0' : 'translate-x-full'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setIsMenu(false)}
                      className={`relative flex-1 flex items-center justify-center gap-2 text-xs md:text-[10px] font-black transition-colors h-full ${!isMenu ? 'text-slate-900' : 'text-slate-500'}`}
                    >
                      SEUL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsMenu(true)}
                      className={`relative flex-1 flex items-center justify-center gap-2 text-xs md:text-[10px] font-black transition-colors h-full ${isMenu ? 'text-red-600' : 'text-slate-500'}`}
                    >
                      MENU
                    </button>
                  </div>
                </div>
              )}

              {/* Crudités Selection - Only for burgers */}
              {category === 'burger' && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Crudités</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {CRUDITES.map(item => (
                      <button 
                        key={item}
                        onClick={() => toggleCrudite(item)}
                        className={`py-3 px-4 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center justify-between ${selectedCrudites.includes(item) ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-600'}`}
                      >
                        {item}
                        {selectedCrudites.includes(item) ? <Plus className="w-3 h-3 rotate-45" /> : <Plus className="w-3 h-3 text-slate-300" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sauce Selection - Only for main dishes */}
              {['burger', 'tacos', 'texmex'].includes(category || '') && (
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Choisir vos sauces (2 max)</h4>
                    <span className="text-[10px] font-bold text-slate-400">{selectedSauces.length}/2</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SAUCES.map(sauce => (
                      <button 
                         key={sauce}
                         onClick={() => toggleSauce(sauce)}
                         className={`py-3 px-4 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center justify-between ${selectedSauces.includes(sauce) ? 'border-red-600 bg-red-50 text-red-600' : (selectedSauces.length >= 2 ? 'opacity-50 cursor-not-allowed border-slate-100 text-slate-400' : 'border-slate-100 text-slate-600')}`}
                         disabled={!selectedSauces.includes(sauce) && selectedSauces.length >= 2}
                      >
                         {sauce}
                         {selectedSauces.includes(sauce) && <div className="w-2 h-2 rounded-full bg-red-600" />}
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
                      onClick={() => onConfirm(selectedSauces, isMenu, selectedVariant, currentPrice, selectedSupplements, selectedCrudites)}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center"
                    >
                      {isEditing ? 'Mettre à jour' : 'Ajouter au panier'} • {finalPrice} DA
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
  onConfirm,
  total
}: { 
  userInfo: UserInfo, 
  setUserInfo: (u: UserInfo) => void, 
  onBack: () => void, 
  onConfirm: () => void,
  total: number
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  const isFormValid = userInfo.name && userInfo.phone && (userInfo.method === 'pickup' || userInfo.address) && userInfo.timeslot;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h3 className="text-xl font-bold text-slate-800">Finaliser la commande</h3>
      </div>
      <hr className="border-slate-100 !mt-2" />

      <div className="space-y-6">
        {/* Method */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mode de retrait</h4>
          <div className="relative p-1 bg-slate-100 rounded-xl flex items-center h-10">
            <div 
              className={`absolute h-8 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${userInfo.method === 'pickup' ? 'translate-x-0' : 'translate-x-full'}`}
            />
            <button 
              type="button"
              onClick={() => setUserInfo({ ...userInfo, method: 'pickup' })}
              className={`relative flex-1 flex items-center justify-center gap-2 text-[10px] font-black transition-colors h-full ${userInfo.method === 'pickup' ? 'text-slate-900' : 'text-slate-500'}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>À EMPORTER</span>
            </button>
            <button 
              type="button"
              onClick={() => setUserInfo({ ...userInfo, method: 'delivery' })}
              className={`relative flex-1 flex items-center justify-center gap-2 text-[10px] font-black transition-colors h-full ${userInfo.method === 'delivery' ? 'text-red-600' : 'text-slate-500'}`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>LIVRAISON</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vos Informations</h4>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input 
                required
                type="text" 
                placeholder="Nom complet *"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="flex-1 w-full px-4 py-3 bg-slate-50 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-base text-slate-900 placeholder:text-slate-500"
              />
              <input 
                required
                type="tel" 
                placeholder="Téléphone *"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                className="flex-1 w-full px-4 py-3 bg-slate-50 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-base text-slate-900 placeholder:text-slate-500"
              />
            </div>
            {userInfo.method === 'delivery' && (
              <textarea 
                required
                placeholder="Adresse de livraison *"
                rows={2}
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-base scrollbar-hide text-slate-900 placeholder:text-slate-500"
              />
            )}
          </div>
        </div>

        {/* Timeslot */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Créneau Souhaité</h4>
          <div className="relative">
            <select 
              required
              value={userInfo.timeslot}
              onChange={(e) => setUserInfo({ ...userInfo, timeslot: e.target.value })}
              className={`w-full px-4 py-3 bg-slate-50 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-base appearance-none ${userInfo.timeslot ? 'text-slate-900' : 'text-slate-500'}`}
            >
              <option value="">Sélectionnez un créneau *</option>
              <option value="Dès que possible">Dès que possible</option>
              <option value="11:30 - 12:00">11:30 - 12:00</option>
              <option value="12:00 - 12:30">12:00 - 12:30</option>
              <option value="12:30 - 13:00">12:30 - 13:00</option>
              <option value="13:00 - 13:30">13:00 - 13:30</option>
              <option value="13:30 - 14:00">13:30 - 14:00</option>
              <option value="14:00 - 14:30">14:00 - 14:30</option>
              <option value="14:30 - 15:00">14:30 - 15:00</option>
              <option value="18:00 - 18:30">18:00 - 18:30</option>
              <option value="18:30 - 19:00">18:30 - 19:00</option>
              <option value="19:00 - 19:30">19:00 - 19:30</option>
              <option value="19:30 - 20:00">19:30 - 20:00</option>
              <option value="20:00 - 20:30">20:00 - 20:30</option>
              <option value="20:30 - 21:00">20:30 - 21:00</option>
              <option value="21:00 - 21:30">21:00 - 21:30</option>
              <option value="21:30 - 22:00">21:30 - 22:00</option>
              <option value="22:00 - 22:30">22:00 - 22:30</option>
              <option value="22:30 - 23:00">22:30 - 23:00</option>
              <option value="23:00 - 23:30">23:00 - 23:30</option>
              <option value="23:30 - 00:00">23:30 - 00:00</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <hr className="border-slate-100 !mt-2" />

      <div className="!mt-2 space-y-6 md:space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Total</span>
            <span className="text-2xl font-black text-slate-900">{total.toLocaleString()} DA</span>
          </div>

          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 bg-slate-900 text-white ${isFormValid ? 'opacity-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            Commander
          </button>
      </div>
    </form>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemove,
  onEdit
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: CartItem[], 
  onUpdateQuantity: (id: string, delta: number) => void,
  onRemove: (id: string) => void,
  onEdit: (item: CartItem) => void
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ 
    name: '', 
    phone: '', 
    address: '', 
    method: 'pickup',
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
      `*Créneau:* ${userInfo.timeslot}\n\n` +
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
    if (item.sauce) details.push(`Sauce: ${item.sauce}`);
    
    if (item.category === 'burger' && item.crudites) {
      if (item.crudites.length === 0) {
        details.push('Sans crudités');
      } else {
        details.push(`Crudités: ${item.crudites.join(', ')}`);
      }
    }

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
            className="fixed inset-x-0 bottom-0 z-50 w-full max-w-[480px] mx-auto max-h-[90vh] bg-white rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl"
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
                                  {item.crudites && (
                                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">
                                      {item.crudites.length === 0 ? 'Sans crudités' : `Crudités: ${item.crudites.join(', ')}`}
                                    </span>
                                  )}
                                  {item.supplements && item.supplements.map(s => (
                                    <span key={s} className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-black uppercase">+{s}</span>
                                  ))}
                                </div>
                                <p className="text-sm font-semibold text-slate-400 mt-1">{item.price} DA / unité</p>
                                <button 
                                  onClick={() => {
                                    onEdit(item);
                                    onClose();
                                  }}
                                  className="mt-1.5 text-[10px] font-medium text-slate-400 hover:text-slate-600 hover:underline flex items-center gap-0.5 transition-all"
                                >
                                  Modifier le produit
                                  <ChevronRight className="w-2.5 h-2.5" />
                                </button>
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
                     total={total}
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeCategory]);

  const activeCategoryData = useMemo(() => CATEGORIES.find(c => c.id === activeCategory), [activeCategory]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      // Collect all items from all categories
      const allItems: any[] = [];
      const seen = new Set();
      
      CATEGORIES.forEach(cat => {
        const items = cat.id === 'pizza' ? PIZZA_MENU : cat.menu || [];
        items.forEach(item => {
          const key = `${cat.id}-${item.name}`;
          if (!seen.has(key)) {
            allItems.push({ ...item, categoryId: cat.id });
            seen.add(key);
          }
        });
      });
      return allItems;
    }
    return activeCategory === 'pizza' ? PIZZA_MENU : activeCategoryData?.menu || [];
  }, [activeCategory, activeCategoryData]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isSmallLogo={true} onLogoClick={onLogoClick} onCallClick={() => window.location.href = 'tel:0782777560'} />
      
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row bg-white">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 border-r border-slate-100 p-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Catégories</h2>
            <nav className="space-y-1">
              {CATEGORIES.map((cat) => (
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
                    {cat.id === 'all' ? <LayoutGrid className="w-4 h-4 md:w-5 md:h-5 text-inherit" /> : cat.icon}
                  </span>
                  {cat.id === 'all' ? 'Voir tout' : (cat.id === 'texmex' ? 'Tex-Mex' : cat.name)}
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
        <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="px-4 pt-2 pb-0">
            <div className="flex overflow-x-auto no-scrollbar gap-6 items-center">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const label = cat.id === 'all' ? 'Tout' : (cat.id === 'texmex' ? 'Tex-Mex' : cat.name);
                return (
                  <button 
                    key={cat.id}
                    onClick={(e) => {
                      setActiveCategory(cat.id);
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                    }}
                    className={`relative pb-3 text-sm transition-colors whitespace-nowrap cursor-pointer shrink-0
                      ${isSelected 
                        ? 'text-slate-900 font-semibold' 
                        : 'text-slate-400 hover:text-slate-600 font-normal'}
                    `}
                  >
                    <span>{label}</span>
                    {isSelected && (
                      <motion.div 
                        layoutId="fullMenuMobileTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-900 rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 pb-10">
          {/* Category Hero Image */}
          <div className="relative h-48 md:h-64 rounded-[32px] md:rounded-[48px] overflow-hidden mb-6 md:mb-12 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <img 
                  src={activeCategory === 'all' ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070' : activeCategoryData?.image} 
                  alt={activeCategory === 'all' ? 'Toute la Carte' : activeCategoryData?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-6 md:bottom-8 left-6 md:left-10">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {activeCategory === 'all' ? 'Toute la Carte' : activeCategoryData?.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-1 bg-red-600 rounded-full" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">L'Artisanale</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
 
          {/* Section Header */}
          <div className={`${activeCategory === 'pizza' ? 'mb-8 md:mb-12' : 'hidden md:flex md:mb-12'} flex flex-col md:flex-row md:items-end justify-between gap-6`}>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-red-600 rounded-full" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-red-600">Sélection du jour</span>
              </div>
              <p className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">
                Découvrez nos saveurs authentiques
              </p>
            </div>
          </div>

          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20"
          >
            {filteredItems.map((item, idx) => {
              const showHeader = activeCategory === 'all' && (idx === 0 || filteredItems[idx - 1].categoryId !== item.categoryId);
              const categoryData = CATEGORIES.find(c => c.id === item.categoryId);
              
              return (
                <div key={`${activeCategory}-${item.name}-${idx}`} className={showHeader ? "col-span-full" : undefined}>
                  {showHeader && (
                    <div className="pt-10 pb-6 mb-6 border-b border-slate-100 flex items-center gap-4 first:pt-4">
                      <div className="bg-red-50 p-3 rounded-2xl text-red-600 shadow-sm shadow-red-100">
                         {categoryData?.icon || <LayoutGrid className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 capitalize tracking-tight">
                          {categoryData?.name || item.categoryId}
                        </h3>
                        <p className="text-xs font-normal text-slate-400 uppercase tracking-wider mt-0.5">{categoryData?.subtitle}</p>
                      </div>
                    </div>
                  )}
                  <MenuListItem 
                    item={item} 
                    category={activeCategory === 'all' ? item.categoryId : activeCategory} 
                    onAddToCart={(v, p) => onAddToCart(item, activeCategory === 'all' ? item.categoryId : activeCategory, v, p)} 
                  />
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-400 text-sm font-bold">Aucun produit dans cette catégorie.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('all');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [customizingCategory, setCustomizingCategory] = useState<string | undefined>();
  const [initialVariant, setInitialVariant] = useState<string | undefined>();
  const [initialPrice, setInitialPrice] = useState<number | undefined>();
  const [initialSauce, setInitialSauce] = useState<string | undefined>();
  const [initialSauces, setInitialSauces] = useState<string[] | undefined>();
  const [initialCrudites, setInitialCrudites] = useState<string[] | undefined>();
  const [initialIsMenu, setInitialIsMenu] = useState<boolean | undefined>();
  const [initialSupplements, setInitialSupplements] = useState<string[] | undefined>();
  const [editingCartId, setEditingCartId] = useState<string | null>(null);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const navigateTo = (page: Page, category?: string) => {
    if (category) {
      setActiveMenuCategory(category);
    } else if (page === 'full_menu') {
      setActiveMenuCategory('all');
    }
    
    if (page === 'home') {
      navigate('/');
    } else {
      navigate('/carte');
    }
    setIsNavOpen(false);
  };

  const startCustomization = (item: MenuItem, category: string, variant?: string, priceVal?: number) => {
    setCustomizingItem(item);
    setCustomizingCategory(category);
    setInitialVariant(variant);
    setInitialPrice(priceVal);
    setInitialSauce(undefined);
    setInitialSauces(undefined);
    setInitialCrudites(undefined);
    setInitialIsMenu(undefined);
    setInitialSupplements(undefined);
    setEditingCartId(null);
  };

  const startEditCartItem = (cartItem: CartItem) => {
    // Find the original MenuItem to pass to the modal
    const allMenuSources = [...PIZZA_MENU, ...BURGER_MENU, ...TACOS_MENU, ...TEXMEX_MENU, ...DESSERT_MENU, ...DRINKS];
    const originalItem = allMenuSources.find(i => i.name === cartItem.name);
    
    if (originalItem) {
      setCustomizingItem(originalItem);
      setCustomizingCategory(cartItem.category);
      setInitialVariant(cartItem.variant);
      // We need to pass the base price of the variant, not the total price
      let basePrice = typeof originalItem.price === 'number' ? originalItem.price : 0;
      if (cartItem.variant && typeof originalItem.price === 'object') {
        const vKey = cartItem.variant.toLowerCase();
        basePrice = (originalItem.price as any)[vKey] || 
                    (vKey === 'standard' ? (originalItem.price as any).standard : 0) || 
                    (vKey === 'grande' ? (originalItem.price as any).large : 0) || 
                    (vKey === 'l' ? (originalItem.price as any).standard : 0) || 
                    (vKey === 'xl' ? (originalItem.price as any).large : 0) || 
                    (originalItem.price as any).standard || 
                    (originalItem.price as any).m || 0;
      }
      
      setInitialPrice(basePrice);
      setInitialSauce(cartItem.sauce);
      setInitialSauces(cartItem.sauces);
      setInitialCrudites(cartItem.crudites);
      setInitialIsMenu(cartItem.isMenu);
      setInitialSupplements(cartItem.supplements);
      setEditingCartId(cartItem.cartId);
    }
  };

  const confirmAddToCart = (sauces?: string[], isMenu?: boolean, variant?: string, price?: number, supplements?: string[], crudites?: string[]) => {
    if (!customizingItem) return;
    
    const supplementsPrice = supplements?.reduce((acc, name) => {
      const supplement = SUPPLEMENTS.find(s => s.name === name);
      return acc + (supplement?.price || 0);
    }, 0) || 0;

    const finalPrice = (isMenu ? (price || 0) + 250 : (price || 0)) + supplementsPrice;
    
    const sauce = sauces && sauces.length > 0 ? sauces.join(', ') : undefined;
    
    // Generate a truly unique ID for this specific addition/edit
    const cartId = editingCartId || `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    setCart(prev => {
      if (editingCartId) {
        // Find existing item to preserve its quantity
        return prev.map(i => i.cartId === editingCartId ? { 
          ...i,
          cartId, // remains same
          name: customizingItem.name,
          category: customizingCategory!,
          price: finalPrice,
          variant, 
          sauce, 
          sauces,
          crudites,
          isMenu,
          supplements
        } : i);
      }

      // Fresh addition - always unique
      return [...prev, { 
        cartId, 
        name: customizingItem.name, 
        category: customizingCategory!,
        price: finalPrice, 
        quantity: 1, 
        variant, 
        sauce, 
        sauces,
        crudites,
        isMenu,
        supplements
      }];
    });

    setCustomizingItem(null);
    setEditingCartId(null);
    setInitialVariant(undefined);
    setInitialPrice(undefined);
    setInitialSauce(undefined);
    setInitialSauces(undefined);
    setInitialCrudites(undefined);
    setInitialIsMenu(undefined);
    setInitialSupplements(undefined);
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

  const isMenuPage = location.pathname === '/carte';

  return (
    <div id="app-root" className="min-h-screen bg-white flex flex-col selection:bg-red-500 selection:text-white">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location}>
          <Route path="/" element={
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HomePage 
                onNavigate={navigateTo} 
                onMenuClick={toggleNav} 
                hasCart={cartCount > 0} 
                onAddToCart={startCustomization}
                activeCategory={activeMenuCategory}
                setActiveCategory={setActiveMenuCategory}
              />
            </motion.div>
          } />
          <Route path="/carte" element={
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
                activeCategory={activeMenuCategory}
                setActiveCategory={(cat) => {
                  setActiveMenuCategory(cat);
                }}
                onLogoClick={() => navigateTo('home')}
              />
            </motion.div>
          } />
        </Routes>
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
        onClose={() => { setCustomizingItem(null); setEditingCartId(null); }}
        onConfirm={confirmAddToCart}
        initialVariant={initialVariant}
        initialPrice={initialPrice}
        initialSauces={initialSauces}
        initialCrudites={initialCrudites}
        initialIsMenu={initialIsMenu}
        initialSupplements={initialSupplements}
        isEditing={!!editingCartId}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onEdit={startEditCartItem}
      />

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-40 max-w-md mx-auto pointer-events-none px-4 flex justify-end">
          <motion.button 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            id="floating-cart"
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto bg-red-600 text-white rounded-full p-4 flex items-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                </span>
            </div>
          </motion.button>
        </div>
      )}
    </div>
  );
}
