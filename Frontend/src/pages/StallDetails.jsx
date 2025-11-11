import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios";
import {
  MapPin,
  Loader2,
  UtensilsCrossed,
  ArrowLeft,
  User,
  Image as ImageIcon,
  Plus,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";
import TokenCart from "../components/Stalls/TokenCart";
import TokenOrderModal from "../components/Stalls/TokenModal";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const StallDetails = () => {
  const { id } = useParams();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  // Cart state
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Token Modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [tokenNumber, setTokenNumber] = useState(null);

  // ✅ Firebase user listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else toast.error("Please log in to manage your cart");
    });
    return () => unsubscribe();
  }, []);

  const uid = user?.uid;

  // ✅ Get Firebase token
  const getFirebaseToken = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please log in first");
        return null;
      }
      return await currentUser.getIdToken();
    } catch (error) {
      console.error("Error fetching Firebase token:", error);
      return null;
    }
  };

  // ✅ Fetch Stall details
  const fetchStall = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URI}/api/stalls/${id}`);
      setStall(res.data);
    } catch (err) {
      console.error("Error fetching stall:", err);
      toast.error("Failed to load stall details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStall();
  }, [id]);

  // ✅ Fetch Cart
 const fetchCart = async () => {
  if (!user || !id) return;
  try {
    setCartLoading(true);
    const token = await getFirebaseToken();
    const res = await axios.get(`${BACKEND_URI}/api/stallCart/${user.uid}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const stallId = res.data?.stallId || id;
    const items = res.data?.items || [];

    setCart(items.map((item) => ({ ...item, stallId })));
  } catch (err) {
    console.error("Error loading cart:", err);
  } finally {
    setCartLoading(false);
  }
};

  useEffect(() => {
    if (uid) fetchCart();
  }, [uid, id]);

  // ✅ Add item
  const addToCart = async (menuItem) => {
    if (!uid) return toast.error("Please log in first");
    setCartOpen(true);
    try {
      const token = await getFirebaseToken();
      await axios.post(
        `${BACKEND_URI}/api/stallCart/add`,
        {
          stallId: id,
          itemId: menuItem._id,
          name: menuItem.name,
          price: Number(menuItem.price) || 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      toast.success(`${menuItem.name} added`);
    } catch (err) {
      console.error("AddToCart Error:", err.response?.data || err);
      toast.error("Failed to add to cart");
    }
  };

  // ✅ Change Qty
  const changeQty = async (itemId, delta) => {
    if (!uid) return toast.error("Please log in first");
    try {
      const token = await getFirebaseToken();
      await axios.put(
        `${BACKEND_URI}/api/stallCart/update`,
        { stallId: id, itemId, delta },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error("ChangeQty Error:", err.response?.data || err);
      toast.error("Failed to update quantity");
    }
  };

  // ✅ Remove Item
  const removeFromCart = async (itemId) => {
    if (!uid) return toast.error("Please log in first");
    try {
      const token = await getFirebaseToken();
      await axios.delete(`${BACKEND_URI}/api/stallCart/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { stallId: id, itemId },
      });
      await fetchCart();
      toast.success("Item removed");
    } catch (err) {
      console.error("RemoveFromCart Error:", err.response?.data || err);
      toast.error("Failed to remove item");
    }
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    if (!uid) return;
    try {
      const token = await getFirebaseToken();
      await axios.delete(`${BACKEND_URI}/api/stallCart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { stallId: id },
      });
      setCart([]);
    } catch (err) {
      console.error("ClearCart Error:", err.response?.data || err);
    }
  };

  // ✅ Total
  const cartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <Loader2 className="animate-spin text-yellow-400 w-10 h-10" />
      </div>
    );

  if (!stall)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-400">
        Stall not found 😢
      </div>
    );

  // ✅ MAIN UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/stalls"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
          >
            <ArrowLeft size={18} /> Back
          </Link>

          <button
            onClick={() => setCartOpen((s) => !s)}
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md"
          >
            <ShoppingCart size={18} /> Cart ({cart.length})
          </button>
        </div>

        {/* Stall Banner */}
        {stall.imageUrl ? (
          <img
            src={stall.imageUrl}
            alt={stall.name}
            className="w-full h-64 object-cover rounded-2xl mb-6 border border-gray-800 shadow-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gray-800 rounded-2xl mb-6 flex justify-center items-center text-gray-500 border border-gray-800">
            <ImageIcon size={48} className="opacity-40" />
          </div>
        )}

        {/* Stall Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg mb-10">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">{stall.name}</h1>
          <p className="text-gray-300 mb-3">{stall.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={15} /> {stall.location || "Unknown location"}
            </span>
            <span className="flex items-center gap-1">
              <User size={15} /> {stall.ownerName || "Unknown Owner"}
            </span>
          </div>
        </div>

        {/* Menu */}
        <h2 className="text-2xl font-semibold text-yellow-400 mb-6 flex items-center gap-2">
          <UtensilsCrossed size={22} /> Menu Items
        </h2>

        {stall.menu?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stall.menu.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-md hover:shadow-yellow-500/20 transition-all flex flex-col"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-gray-700"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-800 flex items-center justify-center rounded-lg mb-3 border border-gray-700 text-gray-500">
                    <ImageIcon size={28} className="opacity-50" />
                  </div>
                )}

                <h3 className="text-lg font-semibold text-yellow-300 mb-1">{item.name}</h3>
                <p className="text-gray-400 text-sm flex-1">
                  {item.description || "No description."}
                </p>
                <p className="text-green-400 font-bold mt-2">₹{item.price}</p>

                <button
                  onClick={() => addToCart(item)}
                  className="mt-3 bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded-md inline-flex items-center gap-2 justify-center"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-8">No menu items.</p>
        )}

        {/* 🧺 Token Cart */}
        {cartOpen && (
          <TokenCart
            cart={cart}
            cartLoading={cartLoading}
            setCartOpen={setCartOpen}
            changeQty={changeQty}
            removeFromCart={removeFromCart}
            cartTotal={cartTotal}
            setOrderModalOpen={setOrderModalOpen}
            user={user}
            clearCart={clearCart}
            setTokenNumber={setTokenNumber}
          />
        )}

        {/* 🎟️ Token Popup Modal */}
        {orderModalOpen && (
          <TokenOrderModal
            tokenNumber={tokenNumber}
            onClose={() => setOrderModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StallDetails;
