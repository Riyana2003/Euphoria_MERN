/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

// Import base images for each model
import base1 from '../assets/base_1.png';
import base2 from '../assets/base_2.png';
import base3 from '../assets/base_3.png';

// Import images from the model folders
import beige1 from '../assets/model1/beige_1.png';
import midnight1 from '../assets/model1/midnight_1.png';
import nude1 from '../assets/model1/nude_1.png';
import red1 from '../assets/model1/red_1.png';

import beige2 from '../assets/model2/beige_2.png';
import midnight2 from '../assets/model2/midnight_2.png';
import nude2 from '../assets/model2/nude_2.png';
import red2 from '../assets/model2/red_2.png';

import beige3 from '../assets/model3/beige_3.png';
import midnight3 from '../assets/model3/midnight_3.png';
import nude3 from '../assets/model3/nude_3.png';
import red3 from '../assets/model3/red_3.png';

// Import eye shadow images
import koh1 from '../assets/model1/koh_1.png';
import laguna1 from '../assets/model1/laguna_1.png';
import kuala1 from '../assets/model1/kuala_1.png';

import koh2 from '../assets/model2/koh_2.png';
import laguna2 from '../assets/model2/laguna_2.png';
import kuala2 from '../assets/model2/kuala_2.png';

import koh3 from '../assets/model3/koh_3.png';
import laguna3 from '../assets/model3/laguna_3.png';
import kuala3 from '../assets/model3/kuala_3.png';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showTryOnPopup, setShowTryOnPopup] = useState(false);
  const [shade, setShade] = useState('');
  const [lipColor, setLipColor] = useState("#ff6b6b66");
  const [selectedModel, setSelectedModel] = useState('model1');
  const [selectedLipColor, setSelectedLipColor] = useState('beige');
  const [selectedEyeColor, setSelectedEyeColor] = useState('laguna');

  const fetchProductData = async () => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`cursor-pointer text-lg ${
            index < rating ? 'text-yellow-500' : 'text-gray-400'
          }`}
          onClick={() => setRating(index + 1)}
        >
          ★
        </span>
      ));
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(Math.max(1, quantity - 1));

  const handleModelClick = (model) => {
    setSelectedModel(model);
  };

  const handleLipColorClick = (color) => {
    setSelectedLipColor(color);
    setShade(color); // Update the shade state when a color is selected
  };

  const handleEyeColorClick = (color) => {
    setSelectedEyeColor(color);
  };

  const getLipColorImage = () => {
    switch (selectedModel) {
      case 'model1':
        switch (selectedLipColor) {
          case 'beige':
            return beige1;
          case 'midnight':
            return midnight1;
          case 'nude':
            return nude1;
          case 'red':
            return red1;
          default:
            return beige1;
        }
      case 'model2':
        switch (selectedLipColor) {
          case 'beige':
            return beige2;
          case 'midnight':
            return midnight2;
          case 'nude':
            return nude2;
          case 'red':
            return red2;
          default:
            return beige2;
        }
      case 'model3':
        switch (selectedLipColor) {
          case 'beige':
            return beige3;
          case 'midnight':
            return midnight3;
          case 'nude':
            return nude3;
          case 'red':
            return red3;
          default:
            return beige3;
        }
      default:
        return beige1;
    }
  };

  const getEyeColorImage = () => {
    switch (selectedModel) {
      case 'model1':
        switch (selectedEyeColor) {
          case 'laguna':
            return laguna1;
          case 'koh':
            return koh1;
          case 'kuala':
            return kuala1;
          default:
            return laguna1;
        }
      case 'model2':
        switch (selectedEyeColor) {
          case 'laguna':
            return laguna2;
          case 'koh':
            return koh2;
          case 'kuala':
            return kuala2;
          default:
            return laguna2;
        }
      case 'model3':
        switch (selectedEyeColor) {
          case 'laguna':
            return laguna3;
          case 'koh':
            return koh3;
          case 'kuala':
            return kuala3;
          default:
            return laguna3;
        }
      default:
        return laguna1;
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 min-h-screen">
      <div className="flex flex-col sm:flex-row gap-12 container mx-auto px-4">
        <div className="flex-1 flex flex-col gap-4 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[20%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                alt=""
                key={index}
                className="w-[20%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-md border border-gray-200"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
              src={image}
              alt=""
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="font-medium text-2xl">{productData.name}</h1>
          <p className="text-sm text-gray-600 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <div className="flex flex-col gap-4 my-8">
              <p className="text-sm font-semibold text-gray-800">Select your shade</p>
              <div className="flex gap-2">
                {productData.shades.map((item, index) => (
                  <button
                    key={index}
                    className={`border py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 ${
                      item === shade ? "border-pink-600 font-semibold" : ""
                    }`}
                    onClick={() => setShade(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <hr className="text-gray-400"></hr>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars()}</div>
            <p className="text-sm text-gray-500">(8 customer reviews)</p>
          </div>
          <p className="text-1xl text-pink-500">
            {currency}
            {productData.price}
          </p>
          <p className="font-medium mt-4">Quantity</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={decreaseQuantity}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center border border-gray-300 rounded-md"
            />
            <button
              onClick={increaseQuantity}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              +
            </button>
          </div>
          <div className="flex justify-start gap-4 mt-4">
            <button
              onClick={() => addToCart(productData._id, shade, quantity)}
              className="flex items-center justify-center bg-pink-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-pink-600 transition ease-in-out w-48"
            >
              <img src={assets.cart} className="w-5 h-5 mr-2" alt="Cart" />
              Add to Cart
            </button>

            {(productData.category === 'Lips' || productData.category === 'Eyes') && (
              <button
                onClick={() => setShowTryOnPopup(true)}
                className="flex items-center justify-center bg-pink-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-pink-600 transition ease-in-out w-48"
              >
                <img src={assets.camera} className="w-5 h-5 mr-2" alt="Try On" />
                Try it On
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Try On Popup */}
      {showTryOnPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Virtual Try-On</h2>
            <div className="flex gap-4">
              {[
                { model: 'model1', base: base1 },
                { model: 'model2', base: base2 },
                { model: 'model3', base: base3 },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-sm font-medium mb-2">Model {index + 1}</span>
                  <img
                    src={item.base} // Always use the base image for the model
                    alt={`Model ${index + 1}`}
                    className={`w-24 h-24 cursor-pointer border ${
                      selectedModel === item.model ? 'border-pink-600' : 'border-gray-200'
                    }`}
                    onClick={() => handleModelClick(item.model)}
                  />
                </div>
              ))}
            </div>
            {productData.category === 'Lips' && (
              <div className="mt-4">
                <div className="flex gap-2">
                  {['beige', 'midnight', 'nude', 'red'].map((color, index) => (
                    <button
                      key={index}
                      className={`border py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 ${
                        color === selectedLipColor ? "border-pink-600 font-semibold" : ""
                      }`}
                      onClick={() => handleLipColorClick(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {productData.category === 'Eyes' && (
              <div className="mt-4">
                <div className="flex gap-2">
                  {['laguna', 'koh', 'kuala'].map((color, index) => (
                    <button
                      key={index}
                      className={`border py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 ${
                        color === selectedEyeColor ? "border-pink-600 font-semibold" : ""
                      }`}
                      onClick={() => handleEyeColorClick(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4">
              <img
                src={productData.category === 'Lips' ? getLipColorImage() : getEyeColorImage()}
                alt="Selected Model"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div className="mt-4">
              <button 
                onClick={() => setShowTryOnPopup(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 container mx-auto px-4">
        <div className="flex gap-2">
          <button className="px-5 py-2 text-sm font-medium">Description</button>
          <button className="px-5 py-2 text-sm text-gray-600">More Information</button>
          <button className="px-5 py-2 text-sm text-gray-600">Reviews</button>
        </div>
        <div className='flex flex-col gap-4 border pc-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
        </div>
      </div>
      <RelatedProducts brand={productData.brand} category={productData.category}/>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;