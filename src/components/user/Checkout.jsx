import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useUserAuth } from "../../contexts/UserAuthContext";

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    instructions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate address
      if (
        !address.street ||
        !address.city ||
        !address.state ||
        !address.zipCode ||
        !address.phone
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Create order
      const order = {
        userId: user.uid,
        items: cart,
        total: getCartTotal(),
        status: "pending",
        paymentMethod: "COD",
        deliveryAddress: address,
        createdAt: serverTimestamp(),
      };

      // Save order to Firestore
      const docRef = await addDoc(collection(db, "orders"), order);

      // Clear cart
      clearCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h3>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">
                  Total
                </span>
                <span className="text-base font-medium text-gray-900">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delivery Address
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="instructions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={address.instructions}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
