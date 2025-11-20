import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Trash2,
  Edit3,
  RefreshCcw,
  KeyRound,
  User,
  Mail,
  Store,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import MyTickets from "../components/my Account/MyTickets";
import MyStallOrders from "../components/my Account/MyStallOrders";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [stallData, setStallData] = useState([]);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [activeTab, setActiveTab] = useState("tickets");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserRoleAndStalls(currentUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserRoleAndStalls = async (currentUser) => {
    try {
      const token = await currentUser.getIdToken(true);
      const res = await axios.get(`${BACKEND_URI}/api/stalls/my-stalls`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const backendRole = res.data.role || "user";
      setRole(backendRole);

      if (backendRole === "stallOwner" || backendRole === "admin") {
        setStallData(res.data.stalls || []);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stall info:", error);
      toast.error("Failed to load your account data.");
      setLoading(false);
    }
  };

  /* ------------------ ADD ITEM (with image) ------------------ */
  const handleAddItem = async (stallId) => {
    if (!newItem.name || !newItem.price)
      return toast.error("Please fill in all required fields!");

    try {
      const token = await user.getIdToken(true);

      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("description", newItem.description);
      if (newItem.image) formData.append("image", newItem.image);

      const res = await axios.post(`${BACKEND_URI}/api/stalls/${stallId}/item`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Item added successfully!");
      updateLocalStall(res.data.menu, stallId);
      setNewItem({ name: "", price: "", description: "", image: null });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item.");
    }
  };

  /* ------------------ DELETE ITEM ------------------ */
  const handleDeleteItem = async (stallId, itemId) => {
    try {
      const token = await user.getIdToken(true);
      const res = await axios.delete(
        `${BACKEND_URI}/api/stalls/${stallId}/item/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🗑️ Item deleted successfully!");
      updateLocalStall(res.data.menu, stallId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item.");
    }
  };

  /* ------------------ UPDATE ITEM (with image) ------------------ */
  const handleUpdateItem = async (stallId, itemId) => {
    try {
      const token = await user.getIdToken(true);

      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("description", newItem.description);
      if (newItem.image) formData.append("image", newItem.image);

      const res = await axios.put(`${BACKEND_URI}/api/stalls/${stallId}/item/${itemId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✏️ Item updated successfully!");
      setUpdatingItemId(null);
      updateLocalStall(res.data.menu, stallId);
      setNewItem({ name: "", price: "", description: "", image: null });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item.");
    }
  };

  const handleResetTokens = async (stallId) => {
    try {
      const token = await user.getIdToken(true);
      await axios.post(
        `${BACKEND_URI}/api/stalls/${stallId}/reset`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Tokens reset successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset tokens.");
    }
  };

 
  const updateLocalStall = (updatedMenu, stallId) => {
    setStallData((prev) =>
      prev.map((s) => (s._id === stallId ? { ...s, menu: updatedMenu } : s))
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <Loader2 className="animate-spin mr-2" /> Loading account...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen text-white bg-black">
        <p>Please log in to view your account.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white py-12 px-6">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <User /> {user.displayName || "User Account"}
            </h1>
            <p className="flex items-center gap-2 text-gray-300">
              <Mail /> {user.email}
            </p>
          </div>
          <div>
            <span
              className={`${
                role === "stallOwner"
                  ? "bg-green-600"
                  : role === "admin"
                  ? "bg-yellow-600"
                  : "bg-blue-600"
              } px-4 py-1 rounded-full font-semibold`}
            >
              {role === "stallOwner"
                ? "Stall Owner"
                : role === "admin"
                ? "Admin"
                : "Regular User"}
            </span>
          </div>
        </div>

{/* ==================== TICKETS & STALL ORDERS SWITCH ==================== */}
<div className="mt-10">
  {/* Tabs */}
  <div className="flex gap-4 mb-6">
    <button
      onClick={() => setActiveTab("tickets")}
      className={`px-6 py-2 rounded-xl font-semibold transition ${
        activeTab === "tickets"
          ? "bg-pink-600 text-white"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
    >
      🎟️ My Event Tickets
    </button>

    <button
      onClick={() => setActiveTab("stallOrders")}
      className={`px-6 py-2 rounded-xl font-semibold transition ${
        activeTab === "stallOrders"
          ? "bg-emerald-600 text-white"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
    >
      🍽️ My Stall Orders
    </button>
  </div>

  {/* Content */}
  {activeTab === "tickets" && <MyTickets />}
  {activeTab === "stallOrders" && <MyStallOrders />}
</div>


        {/* Stall Management */}
        {(role === "stallOwner" || role === "admin") && stallData.length > 0 ? (
          stallData.map((stall) => (
            <div key={stall._id} className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Store /> {stall.name}
                </h2>
                {/* <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGenerateToken(stall._id)}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <KeyRound size={18} /> Generate Token
                  </button>
                  <button
                    onClick={() => handleResetTokens(stall._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <RefreshCcw size={18} /> Reset Tokens
                  </button>
                </div> */}
              </div>

              {/* Add / Update Item Form */}
              <div className="bg-gray-800 p-5 rounded-xl mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PlusCircle size={18} />
                  {updatingItemId ? "Update Item" : "Add New Item"}
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 w-full"
                  />
                </div>

                {/* ✅ Image Upload */}
                <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
                  <label className="flex items-center gap-2 text-gray-300 text-sm">
                    <ImageIcon size={16} /> Upload Image:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewItem({ ...newItem, image: e.target.files[0] })
                    }
                    className="text-sm text-gray-300"
                  />
                  {newItem.image && (
                    <img
                      src={URL.createObjectURL(newItem.image)}
                      alt="preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                    />
                  )}
                  <button
                    onClick={() =>
                      updatingItemId
                        ? handleUpdateItem(stall._id, updatingItemId)
                        : handleAddItem(stall._id)
                    }
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    {updatingItemId ? "Update Item" : "Add Item"}
                  </button>
                </div>
              </div>

              {/* ✅ Item List */}
              <div>
                <h3 className="text-2xl font-bold mb-3">Your Items</h3>
                {stall.menu?.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {stall.menu.map((item) => (
                      <div
                        key={item._id}
                        className="bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-purple-700/40 transition-all"
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-lg mb-3 border border-gray-700"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-900 flex items-center justify-center rounded-lg mb-3 border border-gray-700 text-gray-500">
                            <ImageIcon size={22} className="opacity-50" />
                          </div>
                        )}
                        <h4 className="text-lg font-bold mb-1">{item.name}</h4>
                        <p className="text-gray-300 mb-1">₹{item.price}</p>
                        <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setNewItem({
                                name: item.name,
                                price: item.price,
                                description: item.description,
                              });
                              setUpdatingItemId(item._id);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
                          >
                            <Edit3 size={16} /> Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteItem(stall._id, item._id)
                            }
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No items added yet.</p>
                )}
              </div>
            </div>
          ))
        ) : role === "stallOwner" ? (
          <p className="text-gray-400">No stalls assigned to you yet.</p>
        ) : (
          <div className="text-gray-400 text-lg">
            You are logged in as a{" "}
            <span className="text-blue-400 font-semibold">regular user</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
