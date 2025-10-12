import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, UploadCloud, Edit2, Trash2 } from "lucide-react";

const ImagesPage = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState({
    title: "",
    description: "",
    tags: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch all images
  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/images");
      setImages(res.data.images);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setImageData({ ...imageData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Add or Update image
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", imageData.title);
    formData.append("description", imageData.description);
    formData.append("tags", imageData.tags);
    if (selectedFile) formData.append("image", selectedFile);
    else formData.append("image", imageData.image); // for URL

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/images/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setImageData({ title: "", description: "", tags: "", image: "" });
      setSelectedFile(null);
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit image
  const handleEdit = (img) => {
    setEditId(img._id);
    setImageData({
      title: img.title,
      description: img.description,
      tags: img.tags.join(", "),
      image: img.imageUrl,
    });
  };

  // Delete image
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this image?")) {
      try {
        await axios.delete(`http://localhost:5000/api/images/${id}`);
        fetchImages();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filtered images
  const filteredImages = images.filter(
    (img) =>
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.tags.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          🎨Image Dashboard
        </h1>

        {/* Upload / Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl mb-8 shadow-lg border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Edit Image" : "Add New Image"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={imageData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              value={imageData.tags}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL (optional)"
              value={imageData.image}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 text-gray-200"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={imageData.description}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mt-4 focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="mt-4 bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <UploadCloud size={18} /> {editId ? "Update Image" : "Add Image"}
          </button>
        </form>

        {/* Search */}
        <div className="relative w-full md:w-80 mb-6">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          />
        </div>

        {/* Images Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/80 backdrop-blur-md shadow-lg">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-purple-700/70 to-gray-800 text-gray-200 text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredImages.length > 0 ? (
                filteredImages.map((img) => (
                  <tr
                    key={img._id}
                    className="border-t border-gray-800 hover:bg-gray-900/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{img.title}</td>
                    <td className="px-6 py-4">{img.tags.join(", ")}</td>
                    <td className="px-6 py-4">{img.description}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(img)}
                        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(img._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No images found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImagesPage;
