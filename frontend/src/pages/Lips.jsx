/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import ProductItem from '../components/ProductItem';

const Lips = () => {
  const { products, searchQuery } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(
    products.filter((item) => item.category === 'Lips')
  );
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const toggleBrand = (e) => {
    if (brand.includes(e.target.value)) {
      setBrand(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setBrand(prev => [...prev, e.target.value])
    }
  }

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();
    productsCopy = productsCopy.filter((item) => item.category === 'Lips');
    
    if (brand.length > 0) {
      productsCopy = productsCopy.filter(item => brand.includes(item.brand))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }
    
    if (searchQuery) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = [...filterProducts]; // Create a new array to avoid mutating state directly

    switch (sortType) {
      case 'low-high':
        setFilterProducts([...fpCopy.sort((a, b) => (a.price - b.price))]);
        break;
      case 'high-low':
        setFilterProducts([...fpCopy.sort((a, b) => (b.price - a.price))]);
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    // Initialize with eyes products on first render
    const initialProducts = products.filter((item) => item.category === 'Lips');
    setFilterProducts(initialProducts);
  }, [products]); // Add products as dependency

  useEffect(() => {
    applyFilter();
  }, [brand, category, searchQuery])

  useEffect(() => {
    sortProduct()
  }, [sortType])

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10 border-t px-4 sm:px-8 lg:px-16">
      <div className="sm:min-w-60 w-full sm:w-1/4"> 
        {/* Main Brand Section */}
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2" onClick={() => setShowFilter(!showFilter)}>FILTERS
          <img className={`h-3 sm:hidden rotate-180 transition-transform ${showFilter ? 'rotate-270' : ''}`} src={assets.back} alt=""/>
        </p>
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">BRANDS</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Dior'} onChange={toggleBrand} />DIOR
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Estee Lauder'} onChange={toggleBrand} />ESTEE LAUDER
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Armani Beauty'} onChange={toggleBrand} />ARMANI BEAUTY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Bobbi Brown'} onChange={toggleBrand}/>BOBBI BROWN
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Chanel'}onChange={toggleBrand} />CHANEL
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Charlotee Tilbury'}onChange={toggleBrand}/>CHARLOTEE TILBURY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Fenty Beauty'}onChange={toggleBrand} />FENTY BEAUTY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Hermes Beauty'} onChange={toggleBrand}/>HERMES BEAUTY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Huda Beauty'}onChange={toggleBrand} />HUDA BEAUTY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Lancome'} onChange={toggleBrand}/>LANCOME
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Pat McGrath Labs'}onChange={toggleBrand}/>PAT MCGRATH LABS
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Rare Beauty'}onChange={toggleBrand} />RARE BEAUTY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Tomford Beauty'}onChange={toggleBrand}/>TOMFORD BEAUTY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Valentino Beauty'}onChange={toggleBrand}/>VALENTINO BEAUTY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Westman Atelier'}onChange={toggleBrand}/>WESTMAN ATELIER
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'YSL Beauty'}onChange={toggleBrand}/>YSL BEAUTY
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Tarte '}onChange={toggleBrand}/>TARTE
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Two Faced'}onChange={toggleBrand}/>TWO FACED
            </p>
          </div>
        </div>
        {/*Category Section */}
        <div className={`border border-gray-300 pl-5 py-3 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Face'} onChange={toggleCategory}/>FACE
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Eyes'}onChange={toggleCategory} />EYES
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Lips'} onChange={toggleCategory}/>LIPS
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Tools'} onChange={toggleCategory}/>TOOLS & MAKEUP SETS
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <div className='flex-1'>
        <div className="flex justify-between text-base sm:text-2xl mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">LIPS</h2>
        {/* Product Sort */}
        <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
        <option value="relavent">Sort by: Relavent</option>
        <option value="low-high">Sort by: Low to High</option>
        <option value="high-low">Sort by: High to Low</option>
        </select>
        </div>
      {/* Map Products */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>{
        filterProducts.map((item,index)=>(
          <ProductItem key={index} name= {item.name} id={item._id} price={item.price} image={(item.image)}/>
        ))
        }
        
      </div>
      </div>
    </div>
  );
};

export default Lips;
