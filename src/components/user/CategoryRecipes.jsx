import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useCart } from "../../contexts/CartContext";

export default function CategoryRecipes() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [category, setCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const categoryDoc = await getDocs(collection(db, "categories"));
        const categoryData = categoryDoc.docs
          .find((doc) => doc.id === categoryId)
          ?.data();
        setCategory(categoryData);

        // Fetch recipes for this category
        const recipesQuery = query(
          collection(db, "recipes"),
          where("categoryId", "==", categoryId)
        );
        const recipesSnapshot = await getDocs(recipesQuery);
        const recipesData = recipesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
      } catch (err) {
        setError("Failed to load recipes");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleAddToCart = (recipe) => {
    // Ensure we're passing all necessary data
    const cartItem = {
      id: recipe.id,
      name: recipe.name,
      price: recipe.price,
      imageBase64: recipe.imageBase64,
      quantity: 1,
    };
    addToCart(cartItem);
    setAddedToCart(recipe.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Category not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/home")}
            className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block"
          >
            ← Back to Categories
          </button>
          <div className="flex items-center space-x-4">
            <img
              src={category.imageBase64}
              alt={category.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <h2 className="text-3xl font-extrabold text-gray-900">
              {category.name}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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

                {/* Ingredients Section */}
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Ingredients:
                  </h4>
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                {/* Price and Add to Cart Section */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-indigo-600">
                      ${recipe.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {recipe.ingredients.length} ingredients
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(recipe)}
                    className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                      addedToCart === recipe.id
                        ? "bg-green-600 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {addedToCart === recipe.id
                      ? "Added to Cart!"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No recipes found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
