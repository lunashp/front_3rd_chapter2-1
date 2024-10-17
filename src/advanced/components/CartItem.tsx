import React from 'react';
import { Product } from '../types';
import { useCartContext } from './CartContext';
import { useProductList } from '../hooks/useProductList';

interface CartItemProps {
  product: Product;
  quantity: number;
}

export const CartItem: React.FC<CartItemProps> = ({ product, quantity }) => {
  const { updateQuantity, removeItem } = useCartContext();
  const { increaseStock, decreaseStock, productList } = useProductList();

  // 내부에서 수량을 업데이트하는 함수
  const handleUpdateQuantity = (amount: number) => {
    updateQuantity(product.id, amount, increaseStock, decreaseStock, productList);
  };

  return (
    <div className="flex justify-between items-center mb-2" id={product.id}>
      <span>{`${product.name} - ${product.price}원 x ${quantity}`}</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => handleUpdateQuantity(-1)}
          disabled={quantity <= 0} // 수량이 0 이하일 때 비활성화
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => handleUpdateQuantity(1)}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => removeItem(product.id, increaseStock)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
