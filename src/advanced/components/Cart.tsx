import React from 'react';
import { CartItem } from './CartItem';
import { useCartContext } from './CartContext';

export const Cart: React.FC = () => {
  const { cartItems, totalAmount, itemCount, bonusPoints } = useCartContext(); // useCart 대신 useCartContext 사용

  return (
    <div>
      {cartItems.length > 0 ? (
        cartItems.map((item) => <CartItem key={item.product.id} product={item.product} quantity={item.quantity} />)
      ) : (
        <p>장바구니에 상품이 없습니다.</p>
      )}
      <div id="cart-total" className="text-xl font-bold my-4">
        총액: {Math.round(totalAmount)}원 {itemCount >= 10 && '(10.0% 할인 적용)'}
        <span className="text-blue-500 ml-2">(포인트: {bonusPoints})</span>
      </div>
    </div>
  );
};
