import React from 'react';
import { ProductSelect } from './components/ProductSelect';
import { Cart } from './components/Cart';
import { StockInfo } from './components/StockInfo';
import { CartProvider } from './components/CartContext';

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartProvider>
          <ProductSelect />
          <Cart />
          <StockInfo />
        </CartProvider>
      </div>
    </div>
  );
};

export default App;
