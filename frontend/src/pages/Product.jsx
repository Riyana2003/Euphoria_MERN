/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import TryOnPopup from '../components/TryOnPopup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showTryOnPopup, setShowTryOnPopup] = useState(false);
  const [selectedShade, setSelectedShade] = useState(null);
  const [selectedModel, setSelectedModel] = useState('model1');
  const [selectedLipColor, setSelectedLipColor] = useState('beige');
  const [selectedEyeColor, setSelectedEyeColor] = useState('laguna');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const product = products.find(item => item._id === productId);
      if (product) {
        setProductData(product);
        // Ensure product.image is always an array
        const images = Array.isArray(product.image) ? product.image : [product.image];
        setCurrentImages(images);
        setMainImage(images[0]);
        
        if (product.shades?.length > 0) {
          setSelectedShade({
            ...product.shades[0],
            colorCode: product.shades[0].colorCode || '#FFFFFF'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    if (selectedShade) {
      // Handle shade images properly
      let images = [];
      
      if (selectedShade.image) {
        images = Array.isArray(selectedShade.image) ? selectedShade.image : [selectedShade.image];
      } else if (productData?.image) {
        images = Array.isArray(productData.image) ? productData.image : [productData.image];
      }
      
      setCurrentImages(images);
      if (images.length > 0) {
        setMainImage(images[0]);
      }
    }
  }, [selectedShade, productData]);

  const handleShadeSelect = (shade) => {
    setSelectedShade({
      ...shade,
      colorCode: shade.colorCode || '#FFFFFF'
    });
  };

  const handleAddToCart = () => {
    if (!selectedShade && productData.shades?.length > 0) {
      toast.error('Please select a shade');
      return;
    }

    addToCart(
      productData._id,
      selectedShade?.name || 'Default',
      quantity
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-lg">Product not found</p>
        <button 
          onClick={() => window.history.back()}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-8 container mx-auto px-4 max-w-7xl">
        {/* Product Images */}
        <div className="flex-1 flex flex-col gap-4 lg:flex-row">
          {/* Thumbnail images */}
          <div className="flex lg:flex-col order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto gap-2 lg:w-24">
            {currentImages.map((item, index) => (
              <button
                key={index}
                onClick={() => setMainImage(item)}
                className={`flex-shrink-0 w-20 h-20 lg:w-full lg:h-24 rounded-md overflow-hidden border-2 ${
                  mainImage === item ? 'border-pink-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={item}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = assets.placeholder;
                  }}
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="order-1 lg:order-2 w-full lg:flex-1 bg-white p-4 rounded-lg shadow-md">
            <img
              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
              src={mainImage}
              alt={productData.name}
              onError={(e) => {
                e.target.src = assets.placeholder;
              }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <h1 className="font-bold text-2xl md:text-3xl text-gray-800">{productData.name}</h1>
            {productData.bestseller && (
              <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Bestseller
              </span>
            )}
          </div>

          <p className="text-2xl font-semibold text-pink-600">
            {currency} {productData.price.toFixed(2)}
          </p>

          <p className="text-gray-700">{productData.description}</p>

          {/* Shade Selection */}
          {productData.shades?.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">
                  Shade: {selectedShade?.name || 'Select a shade'}
                </p>
                {selectedShade?.colorCode && (
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: selectedShade.colorCode }}
                  />
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {productData.shades.map((shade, index) => (
                  <button
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${
                      selectedShade?.name === shade.name 
                        ? "border-pink-600 bg-pink-50 shadow-sm" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleShadeSelect(shade)}
                    title={shade.name}
                  >
                    {shade.colorCode && (
                      <div 
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: shade.colorCode || '#FFFFFF' }}
                      />
                    )}
                    <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                      {shade.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <hr className="my-4 border-gray-200" />

          {/* Quantity Selector */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-gray-800">Quantity</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={quantity <= 1}
              >
                <span className="text-xl">−</span>
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  setQuantity(value);
                }}
                className="w-16 text-center border border-gray-300 rounded-lg py-2 px-1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center bg-pink-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-700 transition-colors flex-1"
            >
              <img src={assets.cart} className="w-5 h-5 mr-2" alt="Cart" />
              Add to Cart
            </button>

            {(productData.category === 'Lips' || productData.category === 'Eyes') && (
              <button
                onClick={() => setShowTryOnPopup(true)}
                className="flex items-center justify-center bg-pink-600 text-white px-6 py-3 rounded-lg shadow-md border border-pink-600 hover:bg-pink700 transition-colors flex-1"
              >
             
                Try it On
              </button>
            )}
          </div>

          {/* Product Details */}
          <div className="mt-6">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="font-medium text-gray-800">Brand:</span>
                <span>{productData.brand}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-800">Category:</span>
                <span className="capitalize">{productData.category.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12 container mx-auto px-4 max-w-7xl">
        <div className="flex border-b border-gray-200">
          <button className="px-6 py-3 font-medium text-pink-600 border-b-2 border-pink-600">
            Description
          </button>
        </div>
        <div className="bg-white p-6 rounded-b-lg shadow-sm">
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-3">Product Details</h3>
            <p className="text-gray-700 mb-4">{productData.description}</p>
            
            {productData.shades?.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3">Available Shades</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {productData.shades.map((shade, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg hover:bg-gray-50"
                      onClick={() => handleShadeSelect(shade)}
                    >
                      {shade.colorCode && (
                        <div 
                          className="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: shade.colorCode }}
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{shade.name}</p>
                        {shade.image && (
                          <img 
                            src={Array.isArray(shade.image) ? shade.image[0] : shade.image} 
                            alt={shade.name}
                            className="w-12 h-12 object-cover mt-1 rounded"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-12 container mx-auto px-4 max-w-7xl">
        <RelatedProducts 
          brand={productData.brand} 
          category={productData.category}
          currentProductId={productData._id}
        />
      </div>

      {/* Try On Popup */}
      {showTryOnPopup && (
        <TryOnPopup
          category={productData.category}
          onClose={() => setShowTryOnPopup(false)}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedLipColor={selectedLipColor}
          setSelectedLipColor={setSelectedLipColor}
          selectedEyeColor={selectedEyeColor}
          setSelectedEyeColor={setSelectedEyeColor}
        />
      )}
    </div>
  );
};

export default Product;