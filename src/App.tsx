/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, ReactNode, FormEvent } from 'react';
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
  MessageCircle,
  Home,
  Navigation,
  Star,
  LayoutGrid
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
  { name: 'Marguerita', price: { standard: 450, large: 800 }, description: 'Sauce tomate, fromage, olives.', base: 'tomato', image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg' },
  { name: 'Thon', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, thon, oignons, olives.', base: 'tomato', image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg' },
  { name: 'Poulet', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, poulet, olives.', base: 'tomato', image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg' },
  { name: 'Viande Hachée', price: { standard: 650, large: 1200 }, description: 'Sauce tomate, fromage, viande hachée, olives.', base: 'tomato', image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg' },
  { name: 'Vegie', price: { standard: 600, large: 1100 }, description: 'Sauce tomate, fromage, poivrons, oignons, tomate, aubergines, olives.', base: 'tomato', image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg' },
  { name: 'Oriental', price: { standard: 650, large: 1200 }, description: 'Sauce tomate, fromage, merguez, poivrons, olives.', base: 'tomato', image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg' },
  { name: 'BBQ', price: { standard: 700, large: 1300 }, description: 'Sauce tomate, fromage, viande hachée, oeuf, poivrons, olives, sauce BBQ.', base: 'tomato', image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg' },
  { name: '3 Fromages', price: { standard: 750, large: 1400 }, description: 'Sauce tomate, mozzarella, gruyère, boursin, olives.', base: 'tomato', image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg' },
  { name: "L'Artisanale", price: { standard: 900, large: 1700 }, description: 'Sauce tomate ou crème, viande hachée, poulet fumé, boursin, olives.', base: 'tomato', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400&auto=format&fit=crop' },
  // Base Crème
  { name: 'Forestière', price: { standard: 750, large: 1400 }, description: 'Crème fraîche, fromage, poulet fumé, oignons, champignons, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=400&auto=format&fit=crop' },
  { name: 'Tartiflette', price: { standard: 750, large: 1400 }, description: 'Crème fraîche, fromage, poulet fumé, champignons, pomme de terre, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop' },
  { name: 'Boisée', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, poivrons, sauce fromagère.', base: 'cream', image: 'https://images.unsplash.com/photo-1534080564607-c92751f8933f?q=80&w=400&auto=format&fit=crop' },
  { name: 'Boursin', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, boursin, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { name: 'Raclette', price: { standard: 850, large: 1600 }, description: 'Crème fraîche, fromage, poulet, raclette, pomme de terre, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400&auto=format&fit=crop' },
  { name: "L'Artisanale", price: { standard: 900, large: 1700 }, description: 'Crème fraîche ou sauce tomate, viande hachée, poulet fumé, boursin, olives.', base: 'cream', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400&auto=format&fit=crop' },
  { name: 'Saumon', price: { standard: 1100, large: 2100 }, description: 'Crème fraîche, fromage, saumon, oignons, boursin.', base: 'cream', image: 'https://images.unsplash.com/photo-1544333303-577546e393b2?q=80&w=400&auto=format&fit=crop' },
];

const BURGER_MENU: MenuItem[] = [
  { name: 'Cheese Burger', price: 300, description: 'Pain brioché, Steak, cheddar, crudités.', image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg' },
  { name: 'Chicken Crispy', price: 450, description: 'Pain brioché, Poulet crispy, sauce blanche, crudités.', image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg' },
  { name: 'Double Cheese', price: 600, description: 'Pain brioché, 2 Steaks, double cheddar, crudités.', image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg' },
  { name: 'Double Chicken Crispy', price: 650, description: 'Pain brioché, 2 Poulets crispy, sauce blanche, crudités.', image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg' },
  { name: 'Triple Cheese', price: 800, description: 'Pain brioché, 3 Steaks, 3 cheddars, crudités.', image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg' },
  { name: 'Mix Burger', price: 700, description: 'Pain brioché, Steak, poulet crispy, fromage, crudités.', image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg' },
  { name: 'Le Gourmand', price: 750, description: 'Pain brioché, Steak, dinde fumée, bacon, sauce BBQ, crudités.', image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg' },
];

const TACOS_MENU: MenuItem[] = [
  { name: 'Classique', price: { standard: 600, large: 950 }, description: 'Viande ou escalope, fromagère, crudités, frites, sauce au choix.', image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png' },
  { name: 'Raclette', price: { standard: 800, large: 1150 }, description: 'Viande, raclette, fromagère, crudités, frites, sauce au choix.', image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png' },
  { name: 'Boursin', price: { standard: 700, large: 1050 }, description: 'Escalope, boursin, crème fraîche, crudités, frites, sauce au choix.', image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png' },
  { name: 'Crousty', price: { standard: 750, large: 1100 }, description: 'Tenders, boursin, fromagère, crudités, frites, sauce au choix.', image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png' },
  { name: 'Oriental', price: { standard: 700, large: 1050 }, description: 'Escalope ou viande, fromagère, crudités, frites, poivrons, olives, sauce au choix.', image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png' },
  { name: 'Forestier', price: { standard: 850, large: 1200 }, description: 'Escalope, oignons, champignons, dinde fumée, fromagère, crudités, frites, sauce au choix.', image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png' },
  { name: 'Chicken Beef', price: { standard: 900, large: 1350 }, description: 'Viande, tenders, fromagère, raclette, crudités, frites, sauce au choix.', image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png' },
  { name: 'Double Beef Raclette', price: { standard: 900, large: 1350 }, description: '2 portions viande, raclette, fromagère, crudités, frites, sauce au choix.', image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png' },
];

const TEXMEX_MENU: MenuItem[] = [
  { name: 'CHICKEN PARTY medium', price: 2000, description: 'Le combo parfait : 5 WINGS • 5 TENDERS • 7 NUGGETS • 2 FRITES • 1 BOUTEILLE 1L', image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg' },
  { name: 'CHICKEN PARTY xxl', price: 3500, description: 'Pour toute la famille : 10 WINGS • 10 TENDERS • 14 NUGGETS • 4 FRITES • 1 BOUTEILLE 1L', image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg' },
  { name: 'Wrap Poulet', price: 550, description: 'Poulet mariné, crudités, sauce blanche.', image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg' },
  { name: 'Croque-Monsieur', price: 250, description: 'Pain de mie, dinde fumée, fromage.', image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg' },
  { name: 'Barquette Frites x3', price: 300, image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg' },
  { name: 'Barquette Frites x5', price: 500, image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg' },
  { name: 'Barquette Frites x7', price: 600, image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg' },
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
  { name: 'Tiramisu Maison', price: 450, description: 'Tiramisu traditionnel.', image: 'https://www.macphie.com/app/uploads/2024/09/Tiramisu-Mactop-traditional-1920px-1280x896.jpg' },
  { name: 'Mousse au Chocolat', price: 350, description: 'Chocolat noir.', image: 'https://www.macphie.com/app/uploads/2024/09/Tiramisu-Mactop-traditional-1920px-1280x896.jpg' },
  { name: 'Panacotta Fruits Rouges', price: 400, description: 'Panacotta, coulis fruits rouges.', image: 'https://www.macphie.com/app/uploads/2024/09/Tiramisu-Mactop-traditional-1920px-1280x896.jpg' },
  { name: 'Cheesecake Citron', price: 500, description: 'Cheesecake au citron.', image: 'https://www.macphie.com/app/uploads/2024/09/Tiramisu-Mactop-traditional-1920px-1280x896.jpg' },
];

const DRINKS = [
  { name: 'Eau 33cl', price: 30, image: 'https://www.pequerecetas.com/wp-content/uploads/2013/04/refrescos-para-ninos.jpg' },
  { name: 'Eau gazeuse 33cl', price: 50, image: 'https://www.pequerecetas.com/wp-content/uploads/2013/04/refrescos-para-ninos.jpg' },
  { name: 'Jus 33cl', price: 100, image: 'https://www.pequerecetas.com/wp-content/uploads/2013/04/refrescos-para-ninos.jpg' },
  { name: 'Canette 33cl', price: 100, image: 'https://www.pequerecetas.com/wp-content/uploads/2013/04/refrescos-para-ninos.jpg' },
  { name: 'Boisson gazeuse 1L', price: 150, image: 'https://www.pequerecetas.com/wp-content/uploads/2013/04/refrescos-para-ninos.jpg' },
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
    icon: <UtensilsCrossed className="w-4 h-4 md:w-5 md:h-5" />, 
    image: 'https://lesoeufs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg',
    bentoSpan: 'md:col-span-8'
  },
  { 
    id: 'burger', 
    name: 'Burgers', 
    subtitle: 'Gourmet', 
    menu: BURGER_MENU, 
    icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-orange-400" />, 
    image: 'https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg',
    bentoSpan: 'md:col-span-4'
  },
  { 
    id: 'tacos', 
    name: 'Tacos', 
    subtitle: "Sauce Fromagère Incluse", 
    menu: TACOS_MENU, 
    icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-sm bg-yellow-400" />, 
    image: 'https://www.lactalisfoodservice.fr/app/uploads/2025/05/tacos-montagnard-1.png',
    bentoSpan: 'md:col-span-4'
  },
  { 
    id: 'texmex', 
    name: 'Tex-Mex', 
    subtitle: 'Délices Mix', 
    menu: TEXMEX_MENU, 
    icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-400" />, 
    image: 'https://www.afarmgirlsdabbles.com/wp-content/uploads/2023/04/Chicken-Fries-with-Garlic-Aioli-Sauce52387.jpg',
    bentoSpan: 'md:col-span-8'
  },
  { 
    id: 'drinks', 
    name: 'Boissons', 
    subtitle: 'Fraîcheur', 
    menu: DRINKS, 
    icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-400" />, 
    image: 'https://www.pequerecetas.com/wp-content/uploads/2013/04/refrescos-para-ninos.jpg',
    bentoSpan: 'hidden'
  },
  { 
    id: 'desserts', 
    name: 'Desserts', 
    subtitle: 'Douceurs', 
    menu: DESSERT_MENU, 
    icon: <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-pink-400" />, 
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
    <div className="group py-5 flex flex-col justify-between gap-4 transition-all hover:bg-slate-100/50 rounded-2xl px-4 bg-slate-50/10 md:bg-transparent md:px-2 md:py-6">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-serif text-[1.2rem] md:text-lg font-bold text-slate-950 group-hover:text-red-600 transition-colors leading-tight">
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

      <div className="flex items-center justify-between pt-2">
        <div />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-900 hover:bg-red-600 hover:text-white rounded-full transition-all active:scale-95 shadow-sm"
          aria-label="Ajouter au panier"
        >
          <Plus className="w-5 h-5" />
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
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 md:h-20 flex items-center">
    <div className="max-w-7xl mx-auto w-full px-4 md:px-12 lg:px-24 flex items-center justify-between relative">
        <button onClick={onLogoClick} className="flex items-center gap-2.5 md:gap-2 hover:opacity-80 transition-opacity">
            {useImageLogo ? (
                <img 
                    src="https://scontent.falg7-6.fna.fbcdn.net/v/t39.30808-6/298339068_379924957653168_8646108471508860568_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=EwO7uVSm4CwQ7kNvwFCdIlg&_nc_oc=AdoFYx3L6RqcvVlxaLIILY8TDP-hWAw5rL-YhnuEoVEDRbtv7jPoCzqNyC5pYixYoHI&_nc_zt=23&_nc_ht=scontent.falg7-6.fna&_nc_gid=5Ir_kphaLNa1qX73hPu7mg&_nc_ss=7b289&oh=00_Af4A-933NTSqmoYI4qic2lXzxKKAlxoMxCOyqmvK1XtZ0Q&oe=69FF6900" 
                    alt="L'Artisanale Logo" 
                    className={`${isSmallLogo ? 'w-[45px] h-[45px] md:w-[43px] md:h-[43px]' : 'w-[53px] h-[53px] md:w-[51px] md:h-[51px]'} object-cover rounded shadow-sm border border-slate-100`}
                    referrerPolicy="no-referrer"
                />
            ) : (
                <>
                    <UtensilsCrossed className={`${isSmallLogo ? 'w-[30px] h-[30px] md:w-[22px] md:h-[22px]' : 'w-[35px] h-[35px] md:w-[25px] md:h-[25px]'} text-red-600`} />
                    <span className={`font-bold tracking-tight ${isSmallLogo ? 'text-lg md:text-[18.5px]' : 'text-xl md:text-[21px]'}`}>L'Artisanale</span>
                </>
            )}
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2">
        {title && <h1 className="font-bold text-slate-900 text-lg md:text-xl whitespace-nowrap">{title}</h1>}
        </div>
 
        <div className="flex items-center gap-3 md:gap-4">
            {onBack && (
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 rounded-full bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-bold border border-slate-100"
                >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Retour</span>
                </button>
            )}
            <div className="hidden md:flex items-center gap-6">
                {onOrderClick && (
                  <button 
                    onClick={onOrderClick}
                    className="bg-red-600 text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-slate-900 transition-all shadow-lg shadow-red-900/10"
                  >
                    Commander en ligne
                  </button>
                )}
                {onCallClick && (
                  <button 
                    onClick={onCallClick} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                )}
                {onMenuClick && (
                  <button 
                    onClick={() => onMenuClick?.()} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    <MenuIcon className="w-5 h-5" />
                  </button>
                )}
            </div>
            {onCallClick && (
              <button 
                onClick={onCallClick} 
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 active:scale-95 transition-all -mr-1"
              >
                <Phone className="w-5 h-5" />
              </button>
            )}
            {onMenuClick && (
            <button 
                onClick={() => onMenuClick()} 
                id="header-menu" 
                className="md:hidden p-1 -mr-2 rounded-full hover:bg-slate-100"
            >
                <MenuIcon className="w-8 h-8 text-slate-800" />
            </button>
            )}
        </div>
        {!onMenuClick && !onOrderClick && !onCallClick && <div className="w-10"></div>}
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
          <div className="flex justify-end items-center px-4 py-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
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
            <nav className="flex flex-col gap-6">
              {[
                { label: 'Accueil', action: () => onNavigate('home') },
                { label: 'La Carte', action: () => onNavigate('full_menu') },
                { label: 'Galerie', action: () => {
                  const el = document.getElementById('gallery-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('home');
                  setTimeout(() => {
                    const el2 = document.getElementById('gallery-section');
                    if (el2) el2.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }},
                { label: 'Adresse', href: 'https://maps.app.goo.gl/ooZi92NoWhsah1iX6' },
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
                      className="group py-4 text-center w-full border-b border-transparent hover:border-slate-100 transition-all"
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
                      className="group py-4 text-center block w-full border-b border-transparent hover:border-slate-100 transition-all"
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
              <div className="flex gap-10 md:flex hidden">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-20">
        {/* Column 1: Brand */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/50">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-serif text-2xl font-bold tracking-tight">L'Artisanale</h4>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500">Draria • Qualité Supérieure</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-medium uppercase">
              LE GOÛT AUTHENTIQUE LIVRÉ CHEZ VOUS
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { icon: Instagram, href: "https://www.instagram.com/lartisanale_draria/" },
              { icon: Music, href: "https://tiktok.com" },
              { icon: Facebook, href: "https://www.facebook.com/lartisanaledraria/?locale=fr_FR" }
            ].map((social, i) => (
              <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-all border border-white/5">
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-6">
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
              <button 
                onClick={() => {
                  const el = document.getElementById('gallery-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate?.('home');
                  setTimeout(() => {
                    const el2 = document.getElementById('gallery-section');
                    if (el2) el2.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                Galerie
              </button>
            </li>
            <li>
              <a 
                href="https://maps.app.goo.gl/ooZi92NoWhsah1iX6" 
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
        <div className="space-y-8">
          <h5 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-500">Contact</h5>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 transition-all">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-0.5 tracking-widest">Par Téléphone</p>
                <p className="text-base font-bold underline cursor-pointer hover:text-red-500 transition-colors">0782 77 75 60</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 transition-all">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-0.5 tracking-widest">Localisation</p>
                <p className="text-sm font-bold">Route des Chwayin, Draria</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/5 flex justify-center items-center">
        <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em]">
          L'ARTISANALE DRARIA - 2026
        </p>
      </div>
    </div>
  </footer>
);

const HomePage = ({ onNavigate, onMenuClick, hasCart }: { onNavigate: (p: Page, cat?: string) => void, onMenuClick: () => void, hasCart: boolean }) => {
  const isOpen = checkIsOpen();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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
        useImageLogo={true}
      />
      
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full h-[calc(100dvh-88px)] md:h-[60vh] lg:h-[65vh] flex items-center justify-center overflow-hidden md:overflow-visible">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
                src="https://tb-static.uber.com/prod/image-proc/processed_images/56ca44860149e20d3b8e469263f518fd/c9252e6c6cd289c588c3381bc77b1dfc.jpeg" 
                alt="Hero Pizza" 
                className="w-full h-full object-cover"
            />
            {/* Light Overlay + Gradient over everything */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
          </motion.div>
          
          <div className="relative z-10 text-center px-4 md:px-16 lg:px-24 mb-[18rem] md:mb-0 -mt-12 md:mt-0">
            <div className="flex flex-col items-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="mb-4 flex items-center gap-[6.6px] bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20"
                >
                    <div className={`w-[6.6px] h-[6.6px] rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse`} />
                    <span className="text-[8.8px] text-white font-black uppercase tracking-widest">
                        {isOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                </motion.div>
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-4 tracking-tighter"
                >
                    L'Artisanale
                </motion.h2>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="flex items-center justify-center gap-3 text-white/90"
                >
                    <p className="font-black tracking-[0.4em] uppercase text-[9px] md:text-xs">
                        Le Goût Authentique livré chez vous
                    </p>
                </motion.div>

                {/* Mobile Social Icons - Moved here */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex items-center gap-5 mt-5 md:hidden"
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
                      className="text-white hover:text-red-600 transition-colors transform hover:scale-110 bg-white/10 p-2.5 rounded-full border border-white/20 backdrop-blur-sm"
                    >
                      <social.icon className="w-[20.6px] h-[20.6px]" />
                    </a>
                  ))}
                </motion.div>
            </div>
          </div>

          {/* Action Blocks integrated for mobile visibility */}
          <div className="absolute bottom-16 md:-bottom-16 left-0 right-0 z-20 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <button 
                      id="link-order-online"
                      onClick={() => onNavigate('full_menu')}
                      className="w-full bg-white border border-slate-100 py-[22px] px-5 md:py-[30px] md:px-6 rounded-[20px] flex items-center gap-3.5 text-slate-800 shadow-lg hover:border-red-600 transition-all group active:scale-[0.98]"
                  >
                      <div className="bg-red-50 p-2 md:p-3.5 rounded-xl text-red-600">
                          <ShoppingBag className="w-[21px] h-[21px] md:w-7 md:h-7" />
                      </div>
                      <div className="text-left">
                          <span className="block font-black text-[18px] md:text-2xl leading-tight">Commande en ligne</span>
                          <span className="text-[9px] md:text-[10px] uppercase text-slate-400 font-bold tracking-widest block">Service Rapide</span>
                      </div>
                  </button>

                  <button 
                      onClick={() => onNavigate('full_menu')}
                      className="bg-white border border-slate-100 py-[22px] px-5 md:py-[30px] md:px-6 rounded-[20px] flex items-center gap-3.5 text-slate-800 shadow-lg hover:border-red-600 transition-all group active:scale-[0.98]"
                  >
                      <div className="bg-red-50 p-2 md:p-3.5 rounded-xl text-red-600">
                          <MenuIcon className="w-[21px] h-[21px] md:w-7 md:h-7" />
                      </div>
                      <div className="text-left">
                          <span className="block font-black text-[18px] md:text-2xl leading-tight">Notre carte</span>
                          <span className="text-[9px] md:text-[10px] uppercase text-slate-400 font-bold tracking-widest block">Découvrez nos plats</span>
                      </div>
                  </button>

                  <a 
                      href="https://maps.app.goo.gl/ooZi92NoWhsah1iX6" 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-white border border-slate-100 py-[22px] px-5 md:py-[30px] md:px-6 rounded-[20px] flex items-center gap-3.5 text-slate-800 shadow-lg hover:border-red-600 transition-all group active:scale-[0.98]"
                  >
                      <div className="bg-red-50 p-2 md:p-3.5 rounded-xl text-red-600">
                          <MapPin className="w-[21px] h-[21px] md:w-7 md:h-7" />
                      </div>
                      <div className="text-left">
                          <span className="block font-black text-[18px] md:text-2xl leading-tight">Nous trouver</span>
                          <span className="text-[9px] md:text-[10px] uppercase text-slate-400 font-bold tracking-widest block">Draria, Alger</span>
                      </div>
                  </a>
              </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto w-full px-4 md:px-12 lg:px-24 mt-16 md:mt-24 relative z-0 pb-16">

            {/* Category Grid - Bento Style Optimized for Desktop */}
            <div id="bento-grid" className="mb-16 md:mb-20">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
                    <div className="flex flex-col text-left">
                        <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Notre Carte</span>
                        <h3 className="font-serif text-[32px] md:text-[43px] font-bold text-slate-900 leading-none">Explorer le Menu</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4">
                    {CATEGORIES.filter(c => c.bentoSpan !== 'hidden' && c.id !== 'all').map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => onNavigate('full_menu', cat.id)}
                            className={`relative h-[217px] md:h-[296px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-lg transition-all duration-700 ${cat.bentoSpan}`}
                        >
                            <img 
                                src={cat.image} 
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
                                    <span className="text-[10px] font-black uppercase tracking-widest">Voir le menu</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Nos Incontournables Section */}
            <div className="py-8 md:py-16">
                <div className="flex flex-col text-left mb-12">
                    <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Suggestions</span>
                    <h3 className="font-serif text-[32px] md:text-[43px] font-bold text-slate-900 leading-none">Nos Incontournables</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-y-4">
                    {[
                        { name: 'Pizza Saumon', price: '1100 DA', desc: 'Saumon fumé de qualité, aneth fraîche, crème onctueuse.', cat: 'Signature', catId: 'pizza' },
                        { name: 'Double Smash', price: '900 DA', desc: 'Deux steaks de boeuf pur jus, cheddar affiné, sauce secrète.', cat: 'Gourmet', catId: 'burger' },
                        { name: 'Wrap Poulet', price: '550 DA', desc: 'Poulet mariné 24h, crudités croquantes, sauce maison.', cat: 'Authentique', catId: 'texmex' },
                    ].map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onNavigate('full_menu', item.catId)}
                            className="group py-5 flex flex-col justify-between gap-4 transition-all hover:bg-slate-100/50 rounded-2xl px-4 bg-slate-50/10 md:bg-transparent md:px-2 md:py-6 cursor-pointer border border-transparent hover:border-slate-100"
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-serif text-[19.2px] md:text-lg font-bold text-slate-950 group-hover:text-red-600 transition-colors leading-tight">
                                            {item.name}
                                        </h4>
                                        <span className="text-sm md:text-base font-black text-slate-950 tabular-nums whitespace-nowrap">
                                            {item.price}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-[12px] md:text-sm font-medium leading-relaxed line-clamp-2">
                                        {item.desc}
                                    </p>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600/40 group-hover:bg-red-600 transition-colors" />
                                        <span className="text-[10px] md:text-[11px] font-black uppercase text-slate-400 tracking-wider group-hover:text-slate-500 transition-colors">
                                            {item.cat}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="pt-2 md:pt-0">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onNavigate('full_menu', item.catId);
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-red-600 transition-colors shadow-lg active:scale-95"
                                    >
                                        Commander
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="py-8 md:py-16">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                        <div className="flex flex-col text-left">
                            <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Valeurs</span>
                            <h3 className="font-serif text-[32px] md:text-[43px] font-bold text-slate-900 leading-none">Nos Engagements</h3>
                        </div>
                    </div>
                    <div 
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
                                desc: 'Ouvert du Samedi au Vendredi (fermé le Dimanche). Livraison express sur Draria et ses environs.',
                                color: 'blue'
                            },
                        ].map((item, idx) => (
                            <div 
                                key={idx}
                                className="group p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-700 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[40px] group-hover:bg-red-600/10 transition-all" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-xl bg-white shadow-xl flex items-center justify-center text-red-600 mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-700">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h4 className="font-serif text-[21.6px] md:text-2xl font-bold text-slate-900 mb-4">{item.title}</h4>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium transition-opacity">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            {/* Gallery Section */}
            <div id="gallery-section" className="py-8 md:py-16 scroll-mt-24">
                <div className="flex flex-col text-left mb-12">
                    <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Galerie</span>
                    <h3 className="font-serif text-[32px] md:text-[43px] font-bold text-slate-900 leading-none">La Touche Artisanale</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                    {GALLERY_IMAGES.map((img, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className={`${idx >= 4 ? 'hidden md:block' : ''} aspect-[1/0.92] md:aspect-[5/4] relative group overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg`}
                        >
                            <img 
                                src={img.url} 
                                alt={img.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                <p className="text-white font-bold text-sm md:text-lg text-center">{img.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Review Section */}
            <div className="py-8 md:py-16">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div className="flex flex-col text-left">
                        <h3 className="font-serif text-[32px] md:text-[43px] font-bold text-slate-900 leading-none">Avis Clients</h3>
                    </div>
                    <div 
                        className="flex items-center gap-2.5 md:gap-3 bg-red-50 px-5 py-2.5 md:px-6 md:py-3 rounded-full border border-red-100 shadow-lg shadow-red-900/5 self-start md:self-auto"
                    >
                        <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600 fill-red-600" />
                        <span className="text-[9.5px] md:text-[11px] font-black text-red-600 uppercase tracking-[0.2em]">4.8/5 sur Google</span>
                    </div>
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
                        tags={["Local Guide", "25 avis"]}
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

            <div className="mt-12 md:mt-24 mb-16">
                {/* Localisation Section */}
                <div className="relative overflow-hidden group rounded-[2.5rem] md:rounded-[4rem] border border-slate-100">
                    {/* Background with parallax-like scaling */}
                    <div className="absolute inset-0 bg-slate-950">
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
                                Sam—Jeu : 11h30—15h30 & 18h00—00h00 | Ven : 18h00—00h00 | Dimanche : Fermé
                            </p>
                            
                            <motion.a 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href="https://maps.app.goo.gl/ooZi92NoWhsah1iX6" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl"
                            >
                                <MapPin className="w-4 h-4" />
                                Itinéraire Google Maps
                            </motion.a>
                        </div>
                        
                        {/* Right side info for desktop/tablet removed per request */}
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
      <Header isSmallLogo={true} onBack={onBack} onCallClick={() => window.location.href = 'tel:0782777560'} title={titles[category as keyof typeof titles]} />
      
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
        <div className="px-6 py-3 md:py-6 sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 mb-2 max-w-lg mx-auto">
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
                      className="px-4 pt-4 pb-20 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-12 md:gap-y-4"
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
  const [pizzaBase, setPizzaBase] = useState<'tomato' | 'cream'>('tomato');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeCategory]);

  const activeCategoryData = useMemo(() => CATEGORIES.find(c => c.id === activeCategory), [activeCategory]);

  const filteredPizzaMenu = useMemo(() => {
    return PIZZA_MENU.filter(p => !p.base || p.base === pizzaBase);
  }, [pizzaBase]);

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
    return activeCategory === 'pizza' ? filteredPizzaMenu : activeCategoryData?.menu || [];
  }, [activeCategory, filteredPizzaMenu, activeCategoryData]);

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
        <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="px-4 py-3">
            <div className="flex overflow-x-auto no-scrollbar gap-2">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={(e) => {
                    setActiveCategory(cat.id);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                  }}
                  className={`px-4.5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2
                    ${activeCategory === cat.id 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                      : 'bg-white border border-slate-100 text-slate-500'}
                  `}
                >
                  {cat.id === 'all' ? (
                    <LayoutGrid className={`w-3.5 h-3.5 ${activeCategory === 'all' ? 'text-white' : 'text-slate-600'}`} />
                  ) : (
                    <span className={activeCategory === cat.id ? 'text-white' : 'text-slate-600'}>
                      {cat.icon}
                    </span>
                  )}
                  {cat.id === 'all' ? 'Voir tout' : (cat.id === 'texmex' ? 'Tex-Mex' : cat.name)}
                </button>
              ))}
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
                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
                    {activeCategory === 'all' ? 'Toute la Carte' : activeCategoryData?.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-1 bg-red-600 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">L'Artisanale</span>
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
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Sélection du jour</span>
              </div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Découvrez nos saveurs authentiques
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              {activeCategory === 'pizza' && (
                <div className="bg-slate-50 p-1 rounded-2xl flex border border-slate-100 min-w-0">
                  <button 
                    onClick={() => setPizzaBase('tomato')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${pizzaBase === 'tomato' ? 'bg-white shadow-md text-red-600' : 'text-slate-500'}`}
                  >
                    Tomate
                  </button>
                  <button 
                    onClick={() => setPizzaBase('cream')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${pizzaBase === 'cream' ? 'bg-white shadow-md text-red-600' : 'text-slate-500'}`}
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
            {filteredItems.map((item, idx) => (
              <MenuListItem 
                key={`${activeCategory}-${item.name}-${idx}`} 
                item={item} 
                category={activeCategory === 'all' ? item.categoryId : activeCategory} 
                onAddToCart={(v, p) => onAddToCart(item, activeCategory === 'all' ? item.categoryId : activeCategory, v, p)} 
              />
            ))}
            
            {/* Mini Footer */}
            <div className="mt-12 -mx-4 md:-mx-8 lg:-mx-12 -mb-10 py-14 px-10 bg-slate-900 flex flex-col items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-white">L'Artisanale</span>
              <div className="w-7 h-1 bg-red-600 rounded-full mt-1" />
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">2026 l'artisanale draria</p>
            </div>

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
    <div id="app-root" className="min-h-screen">
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
              <HomePage onNavigate={navigateTo} onMenuClick={toggleNav} hasCart={cartCount > 0} />
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

      {isMenuPage && (
        <>
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
        </>
      )}
    </div>
  );
}
