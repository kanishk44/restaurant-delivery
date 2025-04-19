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

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    categoryId: "",
    ingredients: [""],
    price: "",
    image: null,
    imageBase64: "",
  });
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
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

  const fetchRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const recipesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipesData);
    } catch (err) {
      setError("Failed to fetch recipes");
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

          if (editingRecipe) {
            setEditingRecipe({
              ...editingRecipe,
              image: file,
              imageBase64: compressedBase64,
            });
          } else {
            setNewRecipe({
              ...newRecipe,
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

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients[index] = value;
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const addIngredientField = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, ""],
    });
  };

  const removeIngredientField = (index) => {
    const newIngredients = newRecipe.ingredients.filter((_, i) => i !== index);
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newRecipe.name.trim()) {
      setError("Please enter a recipe name");
      return;
    }

    if (!newRecipe.categoryId) {
      setError("Please select a category");
      return;
    }

    if (!newRecipe.ingredients.some((ing) => ing.trim())) {
      setError("Please add at least one ingredient");
      return;
    }

    if (
      !newRecipe.price ||
      isNaN(newRecipe.price) ||
      parseFloat(newRecipe.price) <= 0
    ) {
      setError("Please enter a valid price");
      return;
    }

    if (!newRecipe.imageBase64) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = await addDoc(collection(db, "recipes"), {
        name: newRecipe.name.trim(),
        categoryId: newRecipe.categoryId,
        ingredients: newRecipe.ingredients.filter((ing) => ing.trim()),
        price: parseFloat(newRecipe.price),
        imageBase64: newRecipe.imageBase64,
        createdAt: new Date(),
      });

      setRecipes([
        ...recipes,
        {
          id: docRef.id,
          name: newRecipe.name.trim(),
          categoryId: newRecipe.categoryId,
          ingredients: newRecipe.ingredients.filter((ing) => ing.trim()),
          price: parseFloat(newRecipe.price),
          imageBase64: newRecipe.imageBase64,
        },
      ]);

      setNewRecipe({
        name: "",
        categoryId: "",
        ingredients: [""],
        price: "",
        image: null,
        imageBase64: "",
      });
    } catch (err) {
      setError("Failed to add recipe");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setNewRecipe({
      name: recipe.name,
      categoryId: recipe.categoryId,
      ingredients: recipe.ingredients,
      price: recipe.price.toString(),
      image: null,
      imageBase64: recipe.imageBase64,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!newRecipe.name.trim()) {
      setError("Please enter a recipe name");
      return;
    }

    if (!newRecipe.categoryId) {
      setError("Please select a category");
      return;
    }

    if (!newRecipe.ingredients.some((ing) => ing.trim())) {
      setError("Please add at least one ingredient");
      return;
    }

    if (
      !newRecipe.price ||
      isNaN(newRecipe.price) ||
      parseFloat(newRecipe.price) <= 0
    ) {
      setError("Please enter a valid price");
      return;
    }

    if (!newRecipe.imageBase64) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateDoc(doc(db, "recipes", editingRecipe.id), {
        name: newRecipe.name.trim(),
        categoryId: newRecipe.categoryId,
        ingredients: newRecipe.ingredients.filter((ing) => ing.trim()),
        price: parseFloat(newRecipe.price),
        imageBase64: newRecipe.imageBase64,
      });

      setRecipes(
        recipes.map((recipe) =>
          recipe.id === editingRecipe.id
            ? {
                ...recipe,
                name: newRecipe.name.trim(),
                categoryId: newRecipe.categoryId,
                ingredients: newRecipe.ingredients.filter((ing) => ing.trim()),
                price: parseFloat(newRecipe.price),
                imageBase64: newRecipe.imageBase64,
              }
            : recipe
        )
      );

      setEditingRecipe(null);
      setNewRecipe({
        name: "",
        categoryId: "",
        ingredients: [""],
        price: "",
        image: null,
        imageBase64: "",
      });
    } catch (err) {
      setError("Failed to update recipe");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "recipes", recipeId));
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
    } catch (err) {
      setError("Failed to delete recipe");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingRecipe(null);
    setNewRecipe({
      name: "",
      categoryId: "",
      ingredients: [""],
      price: "",
      image: null,
      imageBase64: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
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
          {editingRecipe ? "Edit Recipe" : "Add New Recipe"}
        </h2>
        <form
          onSubmit={editingRecipe ? handleUpdate : handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="recipeName"
              className="block text-sm font-medium text-gray-700"
            >
              Recipe Name
            </label>
            <input
              type="text"
              id="recipeName"
              value={newRecipe.name}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter recipe name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={newRecipe.categoryId}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, categoryId: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <div className="space-y-2">
              {newRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {newRecipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientField(index)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredientField}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add Ingredient
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                id="price"
                value={newRecipe.price}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, price: e.target.value })
                }
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="recipeImage"
              className="block text-sm font-medium text-gray-700"
            >
              Recipe Image
            </label>
            <input
              type="file"
              id="recipeImage"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              required={!editingRecipe}
            />
            {(newRecipe.imageBase64 || editingRecipe?.imageBase64) && (
              <div className="mt-2">
                <img
                  src={newRecipe.imageBase64 || editingRecipe?.imageBase64}
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
                ? editingRecipe
                  ? "Updating..."
                  : "Adding..."
                : editingRecipe
                ? "Update Recipe"
                : "Add Recipe"}
            </button>
            {editingRecipe && (
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
        {recipes.map((recipe) => {
          const category = categories.find((c) => c.id === recipe.categoryId);
          return (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <img
                src={recipe.imageBase64}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {recipe.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Category: {category ? category.name : "Unknown"}
                </p>
                <p className="text-sm text-gray-500">
                  Price: ₹{recipe.price.toFixed(2)}
                </p>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Ingredients:
                  </h4>
                  <ul className="text-sm text-gray-500 list-disc list-inside">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(recipe)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
