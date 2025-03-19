/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useEffect } from 'react';
import ProductItem from './ProductItem';

const RelatedProducts = ({brand,category}) => {

    const{products} = useContext(ShopContext);
    const[related,setRelated] = useState([]);

    useEffect(()=>{
        if(products.length > 0){
            let productsCopy =  products.slice();
            productsCopy = productsCopy.filter((item)=> brand === item.brand);
            productsCopy = productsCopy.filter((item)=> category === item.category);

            setRelated(productsCopy.slice(0,5));

        }

    },[products])
  return (
    <div className="my-24 px-4">
      <div className="text-center text-3xl font-semibold py-4">
        <h2>Related Products</h2>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-8">
          {related.map((item, index) => (
            <ProductItem
              key={item._id || index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RelatedProducts
