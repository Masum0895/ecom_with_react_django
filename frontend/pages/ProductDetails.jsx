import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../src/context/CartContext";


function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {addToCart, loading: cartLoading} = useCart();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, BASEURL]);

  const handleAddToCart = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const success = addToCart(product.id);
    if (success) {
      // Option 1: Show success message and stay on page
      alert('Product added to cart!');
    }
    if (loading) {
    return <div className="text-center py-10">Loading...</div>;
    }
    if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }
  
    if (!product) {
      return <div className="text-center py-10">No product found</div>;
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-green-600 mb-6">
              ৳{product.price}
            </p>
            <button 
              onClick={handleAddToCart} 
              disabled={cartLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {cartLoading ? 'Adding...' : 'Add to Cart 🛒'}
            </button>
            <div className="mt-4">
              <a href="/" className="text-blue-600 hover:underline">
                &larr; Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;