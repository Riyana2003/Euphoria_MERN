/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { assets } from '../assets/assets';

// Import base images for each model
import base1 from '../assets/base_1.png';
import base2 from '../assets/base_2.png';
import base3 from '../assets/base_3.png';

// Import images from the model folders
import beige1 from '../assets/model1/beige_1.png';
import midnight1 from '../assets/model1/midnight_1.png';
import red1 from '../assets/model1/red_1.png';

import beige2 from '../assets/model2/beige_2.png';
import midnight2 from '../assets/model2/midnight_2.png';
import red2 from '../assets/model2/red_2.png';

import beige3 from '../assets/model3/beige_3.png';
import midnight3 from '../assets/model3/midnight_3.png';
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

const TryOnPopup = ({ 
  category, 
  onClose, 
  selectedModel, 
  setSelectedModel,
  selectedLipColor,
  setSelectedLipColor,
  selectedEyeColor,
  setSelectedEyeColor
}) => {
  const handleModelClick = (model) => {
    setSelectedModel(model);
  };

  const handleLipColorClick = (color) => {
    setSelectedLipColor(color);
  };

  const handleEyeColorClick = (color) => {
    setSelectedEyeColor(color);
  };

  const getLipColorImage = () => {
    switch (selectedModel) {
      case 'model1':
        switch (selectedLipColor) {
          case 'beige': return beige1;
          case 'midnight': return midnight1;
          case 'red': return red1;
          default: return beige1;
        }
      case 'model2':
        switch (selectedLipColor) {
          case 'beige': return beige2;
          case 'midnight': return midnight2;
          case 'red': return red2;
          default: return beige2;
        }
      case 'model3':
        switch (selectedLipColor) {
          case 'beige': return beige3;
          case 'midnight': return midnight3;
          case 'red': return red3;
          default: return beige3;
        }
      default: return beige1;
    }
  };

  const getEyeColorImage = () => {
    switch (selectedModel) {
      case 'model1':
        switch (selectedEyeColor) {
          case 'laguna': return laguna1;
          case 'koh': return koh1;
          case 'kuala': return kuala1;
          default: return laguna1;
        }
      case 'model2':
        switch (selectedEyeColor) {
          case 'laguna': return laguna2;
          case 'koh': return koh2;
          case 'kuala': return kuala2;
          default: return laguna2;
        }
      case 'model3':
        switch (selectedEyeColor) {
          case 'laguna': return laguna3;
          case 'koh': return koh3;
          case 'kuala': return kuala3;
          default: return laguna3;
        }
      default: return laguna1;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Virtual Try-On</h2>
        <div className="flex gap-4 justify-center">
          {[
            { model: 'model1', base: base1 },
            { model: 'model2', base: base2 },
            { model: 'model3', base: base3 },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-sm font-medium mb-2">Model {index + 1}</span>
              <img
                src={item.base}
                alt={`Model ${index + 1}`}
                className={`w-24 h-24 cursor-pointer border ${
                  selectedModel === item.model ? 'border-pink-600' : 'border-gray-200'
                }`}
                onClick={() => handleModelClick(item.model)}
              />
            </div>
          ))}
        </div>
        {category === 'Lips' && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Select Lip Color</h3>
            <div className="flex gap-2 justify-center">
              {['beige', 'midnight', 'red'].map((color, index) => (
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
        {category === 'Eyes' && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Select Eye Color</h3>
            <div className="flex gap-2 justify-center">
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
        <div className="mt-6">
          <img
            src={category === 'Lips' ? getLipColorImage() : getEyeColorImage()}
            alt="Virtual Try-On"
            className="w-64 h-64 mx-auto object-contain"
          />
        </div>
        <div className="mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TryOnPopup;