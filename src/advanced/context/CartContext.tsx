import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { useDiscount } from '../hooks/useDiscount';

interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  itemCount: number;
  bonusPoints: number;
  addItemToCart: (product: Product, decreaseStock: (id: string, amount: number) => void) => void;
  updateQuantity: (
    productId: string,
    change: number,
    increaseStock: (id: string, amount: number) => void,
    decreaseStock: (id: string, amount: number) => void,
    productList: Product[]
  ) => void;
  removeItem: (productId: string, increaseStock: (id: string, amount: number) => void) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

/**
 * CartProvider 컴포넌트
 * 장바구니 상태 및 관련 로직을 관리하는 Context Provider
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const { getDiscountRate, applyDiscounts, calculateBonusPoints } = useDiscount();

  /**
   * 장바구니의 총 금액 및 보너스 포인트를 계산하는 함수
   * @returns {void}
   */
  const calculateCartTotal = () => {
    let subtotal = 0;
    let totalItems = 0;
    let total = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.product.price * item.quantity;
      const discountRate = getDiscountRate(item.product.id, item.quantity);
      subtotal += itemTotal;
      total += itemTotal * (1 - discountRate);
      totalItems += item.quantity;
    });

    total = applyDiscounts(total, totalItems);

    setItemCount(totalItems);
    setTotalAmount(total);

    const calculatedBonusPoints = calculateBonusPoints(total); // Use the calculate function
    setBonusPoints((prevPoints) => prevPoints + calculatedBonusPoints);
  };

  /**
   * 장바구니에 상품을 추가하는 함수
   * @param {Product} product - 추가할 상품 정보
   * @param {(id: string, amount: number) => void} decreaseStock - 재고 감소 함수
   * @returns {void}
   */
  const addItemToCart = (product: Product, decreaseStock: (id: string, amount: number) => void) => {
    if (product.stock <= 0) {
      alert('해당 상품의 재고가 없습니다.');
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        if (existingItem.quantity + 1 > product.stock) {
          alert('재고가 부족합니다.');
          return prevItems;
        }
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
    decreaseStock(product.id, 1);
  };

  /**
   * 장바구니에서 상품 수량을 업데이트하는 함수
   * @param {string} productId - 업데이트할 상품의 ID
   * @param {number} change - 수량 변경 값 (+1 또는 -1)
   * @param {(id: string, amount: number) => void} increaseStock - 재고 증가 함수
   * @param {(id: string, amount: number) => void} decreaseStock - 재고 감소 함수
   * @param {Product[]} productList - 상품 목록
   * @returns {void}
   */
  const updateQuantity = (
    productId: string,
    change: number,
    increaseStock: (id: string, amount: number) => void,
    decreaseStock: (id: string, amount: number) => void,
    productList: Product[]
  ) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === productId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + change;

        if (newQuantity <= 0) {
          removeItem(productId, increaseStock);
          return prevItems.filter((item) => item.product.id !== productId);
        }

        const product = productList.find((item) => item.id === productId);
        if (product && product.stock >= newQuantity) {
          return prevItems.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item));
        }
      }
      return prevItems;
    });
  };

  /**
   * 장바구니에서 상품을 제거하는 함수
   * @param {string} productId - 제거할 상품의 ID
   * @param {(id: string, amount: number) => void} increaseStock - 재고 증가 함수
   * @returns {void}
   */
  const removeItem = (productId: string, increaseStock: (id: string, amount: number) => void) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === productId);
      if (existingItem) {
        increaseStock(productId, existingItem.quantity);
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  /**
   * 장바구니의 아이템이 변경될 때마다 총 금액을 재계산하는 useEffect 훅
   * @returns {void}
   */
  React.useEffect(() => {
    calculateCartTotal();
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, totalAmount, itemCount, bonusPoints, addItemToCart, updateQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
};
