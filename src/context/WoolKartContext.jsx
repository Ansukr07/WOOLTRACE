import React, { createContext, useContext, useState, useEffect } from 'react';

const WoolKartContext = createContext();

export const useWoolKart = () => {
  return useContext(WoolKartContext);
};

export const WoolKartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('woolkart_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('woolkart_orders');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('woolkart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('woolkart_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { 
                ...item, 
                quantity: item.quantity + quantity, 
                subtotal: (item.quantity + quantity) * item.unitPrice 
              } 
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        quantity: quantity,
        unitPrice: product.price,
        unit: product.unit || 'kg',
        image: product.images ? product.images[0] : null,
        subtotal: product.price * quantity
      }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.unitPrice }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <WoolKartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      orders,
      addOrder
    }}>
      {children}
    </WoolKartContext.Provider>
  );
};
