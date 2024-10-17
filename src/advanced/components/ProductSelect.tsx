import React, { useState } from 'react';
import { useProductList } from '../hooks/useProductList';
import { useCartContext } from './CartContext';

export const ProductSelect: React.FC = () => {
  const { productList, decreaseStock } = useProductList();
  const { addItemToCart } = useCartContext(); // useCart 대신 useCartContext 사용
  const [selectedProductId, setSelectedProductId] = useState<string>(productList[0]?.id || '');

  const handleAddToCart = () => {
    const selectedProduct = productList.find((product) => product.id === selectedProductId);
    if (selectedProduct) {
      addItemToCart(selectedProduct, decreaseStock);
    }
    console.log(selectedProduct, 'click');
  };

  return (
    <div>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        {productList.map((product) => (
          <option key={product.id} value={product.id} disabled={product.stock === 0}>
            {`${product.name} - ${product.price}원`}
          </option>
        ))}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToCart}>
        추가
      </button>
    </div>
  );
};
