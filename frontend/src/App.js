import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import NewProduct from './components/Products/NewProduct';
import ProductList from './components/Products/ProductList';
import { fetchProducts, addProduct } from './config/api';
import './App.css';

function App() {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const responseData = await fetchProducts();
        setLoadedProducts(responseData.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        alert('Failed to load products');
      }
      setIsLoading(false);
    };

    getProducts();
  }, []);

  const addProductHandler = async (productName, productPrice) => {
    try {
      const { response, newProduct } = await addProduct(productName, productPrice);

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message);
      }

      const responseData = await response.json();

      setLoadedProducts(prevProducts => {
        return prevProducts.concat({
          ...newProduct,
          id: responseData.product.id
        });
      });
    } catch (error) {
      alert(error.message || 'Something went wrong!');
    }
  };

  return (
    <React.Fragment>
      <Header />
      <main>
        <NewProduct onAddProduct={addProductHandler} />
        {isLoading && <p className="loader">Loading...</p>}
        {!isLoading && <ProductList items={loadedProducts} />}
      </main>
    </React.Fragment>
  );
}

export default App;
