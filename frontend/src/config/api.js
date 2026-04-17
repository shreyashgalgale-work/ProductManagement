const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  GET_PRODUCTS: `${API_BASE_URL}/products`,
  ADD_PRODUCT: `${API_BASE_URL}/product`,
  HEALTH_CHECK: `${API_BASE_URL}/health`
};

export const fetchProducts = async () => {
  const response = await fetch(API_ENDPOINTS.GET_PRODUCTS);
  return response.json();
};

export const addProduct = async (productName, productPrice) => {
  const newProduct = {
    title: productName,
    price: +productPrice
  };

  const response = await fetch(API_ENDPOINTS.ADD_PRODUCT, {
    method: 'POST',
    body: JSON.stringify(newProduct),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return { response, newProduct };
};