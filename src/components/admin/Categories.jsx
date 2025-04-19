import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    image: null,
    imageBase64: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 800; // Maximum width or height
          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality compression
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          if (editingCategory) {
            setEditingCategory({
              ...editingCategory,
              image: file,
              imageBase64: compressedBase64,
            });
          } else {
            setNewCategory({
              ...newCategory,
              image: file,
              imageBase64: compressedBase64,
            });
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", {
      name: newCategory.name,
      image: newCategory.image,
      imageBase64: newCategory.imageBase64,
    });

    if (!newCategory.name.trim()) {
      setError("Please enter a category name");
      return;
    }

    if (!newCategory.imageBase64) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Add category to Firestore with base64 image
      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategory.name.trim(),
        imageBase64: newCategory.imageBase64,
        createdAt: new Date(),
      });

      // Update local state
      setCategories([
        ...categories,
        {
          id: docRef.id,
          name: newCategory.name.trim(),
          imageBase64: newCategory.imageBase64,
        },
      ]);

      // Reset form
      setNewCategory({
        name: "",
        image: null,
        imageBase64: "",
      });
    } catch (err) {
      setError("Failed to add category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      image: null,
      imageBase64: category.imageBase64,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      setError("Please enter a category name");
      return;
    }

    if (!newCategory.imageBase64) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateDoc(doc(db, "categories", editingCategory.id), {
        name: newCategory.name.trim(),
        imageBase64: newCategory.imageBase64,
      });

      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: newCategory.name.trim(),
                imageBase64: newCategory.imageBase64,
              }
            : cat
        )
      );

      setEditingCategory(null);
      setNewCategory({
        name: "",
        image: null,
        imageBase64: "",
      });
    } catch (err) {
      setError("Failed to update category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "categories", categoryId));
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } catch (err) {
      setError("Failed to delete category");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategory({
      name: "",
      image: null,
      imageBase64: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>
        <form
          onSubmit={editingCategory ? handleUpdate : handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="categoryImage"
              className="block text-sm font-medium text-gray-700"
            >
              Category Image
            </label>
            <input
              type="file"
              id="categoryImage"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              required={!editingCategory}
            />
            {(newCategory.imageBase64 || editingCategory?.imageBase64) && (
              <div className="mt-2">
                <img
                  src={newCategory.imageBase64 || editingCategory?.imageBase64}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading
                ? editingCategory
                  ? "Updating..."
                  : "Adding..."
                : editingCategory
                ? "Update Category"
                : "Add Category"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <img
              src={category.imageBase64}
              alt={category.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">
                {category.name}
              </h3>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
