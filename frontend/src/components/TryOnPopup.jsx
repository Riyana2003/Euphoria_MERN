/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

// Import base and model images
import base1 from '../assets/base_1.png';
import base2 from '../assets/base_2.png';
import base3 from '../assets/base_3.png';

import model1 from '../assets/model_1_bobbi.jpeg';
import model2 from '../assets/model_2_bobbi.jpeg';
import model3 from '../assets/model_3_bobbi.jpeg';

// Dior Lipstick (legacy)
import beige1 from '../assets/model1/beige_1.png';
import midnight1 from '../assets/model1/midnight_1.png';
import red1 from '../assets/model1/red_1.png';

import beige2 from '../assets/model2/beige_2.png';
import midnight2 from '../assets/model2/midnight_2.png';
import red2 from '../assets/model2/red_2.png';

import beige3 from '../assets/model3/beige_3.png';
import midnight3 from '../assets/model3/midnight_3.png';
import red3 from '../assets/model3/red_3.png';

// Bobbi Brown Lipsticks
import downtownplum1 from '../assets/model1/m1-downtown plum.png';
import neutralrose1 from '../assets/model1/m1-neutralrose.png';
import parisianred1 from '../assets/model1/m1-parisianred.png';
import pinkcloud1 from '../assets/model1/m1-pink cloud.png';

import downtownplum2 from '../assets/model2/m2-downtown plum.png';
import neutralrose2 from '../assets/model2/m2-neutralrose.png';
import parisianred2 from '../assets/model2/m2-parisian red.png';
import pinkcloud2 from '../assets/model2/m2-pinkcloud.png';

import downtownplum3 from '../assets/model3/m3-downtownplum.png';
import neutralrose3 from '../assets/model3/m3-neutralrose.png';
import parisianred3 from '../assets/model3/m3-parisianred.png';
import pinkcloud3 from '../assets/model3/m3-pinkcloud.png';

// Eye shadows
import metallic1 from '../assets/model1/m1-metallic.png';
import roseviel1 from '../assets/model1/m1-roseviel.png';

import metallic2 from '../assets/model2/m2-metallic.png';
import roseviel2 from '../assets/model2/m2-rose-viel.png';

import metallic3 from '../assets/model3/m3-metallic.png';
import roseviel3 from '../assets/model3/m3-roseviel.png';

const TryOnPopup = ({
  category,
  brand,
  onClose,
  selectedModel,
  setSelectedModel,
  selectedLipColor,
  setSelectedLipColor,
  selectedEyeColor,
  setSelectedEyeColor
}) => {
  const handleModelClick = (model) => setSelectedModel(model);
  const handleLipColorClick = (color) => setSelectedLipColor(color);
  const handleEyeColorClick = (color) => setSelectedEyeColor(color);

  const getLipColorImage = () => {
    if (brand === 'Bobbi Brown') {
      switch (selectedModel) {
        case 'model1':
          return {
            'Downtown Plum': downtownplum1,
            'Neutral Rose': neutralrose1,
            'Parisian Red': parisianred1,
            'Pink Cloud': pinkcloud1
          }[selectedLipColor] || downtownplum1;
        case 'model2':
          return {
            'Downtown Plum': downtownplum2,
            'Neutral Rose': neutralrose2,
            'Parisian Red': parisianred2,
            'Pink Cloud': pinkcloud2
          }[selectedLipColor] || downtownplum2;
        case 'model3':
          return {
            'Downtown Plum': downtownplum3,
            'Neutral Rose': neutralrose3,
            'Parisian Red': parisianred3,
            'Pink Cloud': pinkcloud3
          }[selectedLipColor] || downtownplum3;
        default:
          return downtownplum1;
      }
    } else if (brand === 'Dior') {
      switch (selectedModel) {
        case 'model1':
          return { beige: beige1, midnight: midnight1, red: red1 }[selectedLipColor] || beige1;
        case 'model2':
          return { beige: beige2, midnight: midnight2, red: red2 }[selectedLipColor] || beige2;
        case 'model3':
          return { beige: beige3, midnight: midnight3, red: red3 }[selectedLipColor] || beige3;
        default:
          return beige1;
      }
    }
  };

  const getEyeColorImage = () => {
    const eyeColors = {
      model1: { 'Rose Viel': roseviel1, 'Metallic Mauve': metallic1 },
      model2: { 'Rose Viel': roseviel2, 'Metallic Mauve': metallic2 },
      model3: { 'Rose Viel': roseviel3, 'Metallic Mauve': metallic3 }
    };
    return eyeColors[selectedModel]?.[selectedEyeColor] || roseviel1;
  };

  const getModelImage = (model) => {
    if (brand === 'Bobbi Brown' && category === 'Lips') {
      return model === 'model1' ? model1 : 
             model === 'model2' ? model2 : 
             model3;
    } else {
      return model === 'model1' ? base1 : 
             model === 'model2' ? base2 : 
             base3;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-6 text-pink-600">Virtual Try-On</h2>

        <div className="flex gap-4 justify-center mb-4">
          {['model1', 'model2', 'model3'].map((model, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-sm mb-2 font-medium">Model {index + 1}</span>
              <img
                src={getModelImage(model)}
                alt={`Model ${index + 1}`}
                className={`w-24 h-24 object-cover rounded-full cursor-pointer border-4 ${
                  selectedModel === model ? 'border-pink-600' : 'border-gray-200'
                }`}
                onClick={() => handleModelClick(model)}
              />
            </div>
          ))}
        </div>

        {category === 'Lips' && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Select Lip Color</h3>
            <div className="flex gap-3 justify-center flex-wrap">
              {(brand === 'Bobbi Brown'
                ? ['Downtown Plum', 'Neutral Rose', 'Parisian Red', 'Pink Cloud']
                : ['beige', 'midnight', 'red']
              ).map((color, index) => (
                <button
                  key={index}
                  className={`border py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 capitalize ${
                    color === selectedLipColor ? 'border-pink-600 font-semibold' : ''
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
              {['Rose Viel', 'Metallic Mauve'].map((color, index) => (
                <button
                  key={index}
                  className={`border py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 ${
                    color === selectedEyeColor ? 'border-pink-600 font-semibold' : ''
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
            alt="Virtual Try-On Result"
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