'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaSearch, FaShoppingCart, FaStar, FaStarHalfAlt, FaRupeeSign, FaFlask, FaCubes, FaBox, FaPlus, FaMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const storeItems = [
  { id: 1, name: 'PathLab Premium Kit', description: 'Complete lab management starter kit with sample collection tools', price: 2499, rating: 4.5, reviews: 128, image: '🧪', category: 'Equipment', inStock: true },
  { id: 2, name: 'Report Stationery Pack', description: 'Professional report papers and letterheads (500 sheets)', price: 599, rating: 4.2, reviews: 89, image: '📄', category: 'Stationery', inStock: true },
  { id: 3, name: 'Sample Collection Vials', description: 'Set of 50 sterile collection vials with labels', price: 899, rating: 4.7, reviews: 245, image: '🔬', category: 'Supplies', inStock: true },
  { id: 4, name: 'PathLab Branded Lab Coat', description: 'Premium quality white lab coat with PathLab embroidery', price: 1499, rating: 4.3, reviews: 56, image: '🥼', category: 'Apparel', inStock: true },
  { id: 5, name: 'Digital Thermometer', description: 'Contactless infrared thermometer for patient screening', price: 1299, rating: 4.6, reviews: 178, image: '🌡️', category: 'Equipment', inStock: true },
  { id: 6, name: 'PathLab Mobile App License', description: '1-year license for PathLab patient mobile app', price: 4999, rating: 4.8, reviews: 312, image: '📱', category: 'Software', inStock: true },
  { id: 7, name: 'Gloves Box (100 pcs)', description: 'Premium nitrile examination gloves, powder-free', price: 399, rating: 4.1, reviews: 67, image: '🧤', category: 'Supplies', inStock: false },
  { id: 8, name: 'PathLab Branded Pen Set', description: 'Set of 10 premium ball pens with PathLab branding', price: 199, rating: 4.0, reviews: 34, image: '🖊️', category: 'Stationery', inStock: true },
];

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = ['All', ...new Set(storeItems.map(i => i.category))];

  const filtered = storeItems.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: typeof storeItems[0]) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { id: item.id, name: item.name, price: item.price, qty: 1 }]);
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (id: number) => {
    const existing = cart.find(c => c.id === id);
    if (existing && existing.qty > 1) setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c));
    else setCart(cart.filter(c => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
      else stars.push(<FaStar key={i} className="text-gray-300 text-xs" />);
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaStore className="text-blue-500" /> PathLab Store</h1><p className="text-gray-500 text-sm">Equipment, supplies, and software</p></div>
        <button onClick={() => setShowCart(!showCart)} className="btn-secondary relative flex items-center gap-2">
          <FaShoppingCart /> Cart {cart.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">{cart.reduce((s, c) => s + c.qty, 0)}</span>}
        </button>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md"><FaSearch className="absolute left-3.5 top-3.5 text-gray-400" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search store..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" /></div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            whileHover={{ y: -4 }} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-3">{item.image}</div>
            <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
            <p className="text-xs text-gray-400 mt-1 mb-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center gap-1 mb-2">{renderStars(item.rating)}<span className="text-xs text-gray-400 ml-1">({item.reviews})</span></div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-600">₹{item.price.toLocaleString()}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{item.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            <button
              disabled={!item.inStock}
              onClick={() => addToCart(item)}
              className="w-full mt-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowCart(false)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FaShoppingCart /> Cart ({cart.reduce((s, c) => s + c.qty, 0)})</h2>
                  <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div><p className="font-medium text-sm text-gray-800">{item.name}</p><p className="text-xs text-gray-400">₹{item.price.toLocaleString()} × {item.qty}</p></div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-white border rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"><FaMinus size={10} /></button>
                        <span className="w-8 text-center font-medium text-sm">{item.qty}</span>
                        <button onClick={() => addToCart(storeItems.find(i => i.id === item.id)!)} className="w-7 h-7 bg-white border rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"><FaPlus size={10} /></button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && <div className="text-center py-12 text-gray-400"><FaStore className="text-4xl mx-auto mb-3 text-gray-300" /><p>Your cart is empty</p></div>}
                </div>
                {cart.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between mb-4"><span className="font-semibold text-gray-800">Total:</span><span className="text-xl font-bold text-blue-600">₹{cartTotal.toLocaleString()}</span></div>
                    <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition">Proceed to Checkout</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}