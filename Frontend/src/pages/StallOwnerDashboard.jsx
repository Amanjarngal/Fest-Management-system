import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  Store,
} from "lucide-react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const StallOwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [dashboard, setDashboard] = useState({ stalls: [], orders: [] });

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Firebase Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setFirebaseLoading(false);
      if (user) fetchDashboard(user);
      else {
        toast.error("Please login again");
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const fetchDashboard = async (user) => {
    try {
      const token = await user.getIdToken(true);

      const res = await axios.get(`${BACKEND_URI}/api/stalls/owner/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDashboard({
        stalls: res.data.stalls || [],
        orders: res.data.orders || [],
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dashboard");
      setLoading(false);
    }
  };

  /* ------------------ COMPLETE ORDER ------------------ */
  const completeOrder = async (orderId) => {
    try {
      const token = await auth.currentUser.getIdToken(true);

      await axios.put(
        `${BACKEND_URI}/api/stalls/order/${orderId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order marked completed");

      setDashboard((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "COMPLETED" } : o
        ),
      }));
    } catch (err) {
      toast.error("Could not update order");
    }
  };

  /* ------------------ ADD ITEM ------------------ */
  const handleAddItem = async (stallId) => {
    if (!newItem.name || !newItem.price)
      return toast.error("Fill all required fields!");

    try {
      const token = await auth.currentUser.getIdToken(true);

      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("description", newItem.description);
      if (newItem.image) formData.append("image", newItem.image);

      const res = await axios.post(
        `${BACKEND_URI}/api/stalls/${stallId}/item`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      updateLocalStall(res.data.menu, stallId);
      toast.success("Item added successfully!");

      setNewItem({ name: "", price: "", description: "", image: null });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    }
  };

  /* ------------------ UPDATE ITEM ------------------ */
  const handleUpdateItem = async (stallId, itemId) => {
    try {
      const token = await auth.currentUser.getIdToken(true);

      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("description", newItem.description);
      if (newItem.image) formData.append("image", newItem.image);

      const res = await axios.put(
        `${BACKEND_URI}/api/stalls/${stallId}/item/${itemId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Item updated successfully!");
      setUpdatingItemId(null);
      updateLocalStall(res.data.menu, stallId);

      setNewItem({ name: "", price: "", description: "", image: null });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    }
  };

  /* ------------------ DELETE ITEM ------------------ */
  const handleDeleteItem = async (stallId, itemId) => {
    try {
      const token = await auth.currentUser.getIdToken(true);

      const res = await axios.delete(
        `${BACKEND_URI}/api/stalls/${stallId}/item/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Item deleted!");
      updateLocalStall(res.data.menu, stallId);
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  /* ------------------ UPDATE LOCAL STALL DATA ------------------ */
  const updateLocalStall = (menu, stallId) => {
    setDashboard((prev) => ({
      ...prev,
      stalls: prev.stalls.map((stall) =>
        stall._id === stallId ? { ...stall, menu } : stall
      ),
    }));
  };

  if (loading || firebaseLoading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader2 className="animate-spin" />
      </div>
    );

  // GROUP ORDERS BY STALL
  const stallGroups = dashboard.stalls.map((stall) => ({
    stall,
    orders: dashboard.orders.filter((o) => o.stallId === stall._id),
    earnings: dashboard.orders
      .filter((o) => o.stallId === stall._id)
      .reduce((sum, o) => sum + o.totalAmount, 0),
  }));

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Stall Owner Dashboard
        </h1>

        {stallGroups.map(({ stall, orders, earnings }) => (
          <div
            key={stall._id}
            className="mb-16 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 shadow-lg shadow-purple-900/20"
          >
            {/* Stall Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Store size={32} className="text-pink-400" />
                <h2 className="text-3xl font-bold text-pink-300">
                  {stall.name}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Total Earnings</p>
                <p className="text-3xl font-bold text-green-400">₹{earnings}</p>
              </div>
            </div>

            {/* ------------------ ITEM MANAGEMENT ------------------ */}
            <div className="bg-gray-800/60 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PlusCircle size={18} />
                {updatingItemId ? "Update Item" : "Add New Item"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div className="mt-4 flex items-center gap-4">
                <label className="text-gray-300 text-sm flex items-center gap-2">
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

                {/* SUBMIT BUTTON */}
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

            {/* ------------------ ITEMS LIST ------------------ */}
            <h3 className="text-2xl font-bold mb-4">Your Items</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {stall.menu?.map((item) => (
                <div key={item._id} className="bg-gray-800 p-5 rounded-xl">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center rounded-lg text-gray-400">
                      <ImageIcon size={22} />
                    </div>
                  )}

                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-gray-300">₹{item.price}</p>
                  <p className="text-gray-400 text-sm mb-3">
                    {item.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setNewItem({
                          name: item.name,
                          price: item.price,
                          description: item.description,
                          image: null,
                        });
                        setUpdatingItemId(item._id);
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
                    >
                      <Edit3 size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteItem(stall._id, item._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ------------------ ORDERS SECTION ------------------ */}
            <h3 className="text-2xl font-bold mb-3 text-purple-300">
              Orders for {stall.name}
            </h3>

            {orders.length === 0 ? (
              <p className="text-gray-400">No orders yet.</p>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gray-800/60 p-5 rounded-xl border border-gray-700"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-pink-400 font-semibold">
                          🎟 Token #{order.tokenNumber}
                        </p>
                        <p>Amount: ₹{order.totalAmount}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>

                        <div className="mt-3">
                          {order.items.map((i) => (
                            <p key={i.itemId}>
                              • {i.quantity} × {i.name} — ₹{i.price}
                            </p>
                          ))}
                        </div>
                      </div>

                      {order.orderStatus === "COMPLETED" ? (
                        <span className="text-green-400 font-bold text-lg">
                          ✔ Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => completeOrder(order._id)}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <CheckCircle size={18} /> Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StallOwnerDashboard;
