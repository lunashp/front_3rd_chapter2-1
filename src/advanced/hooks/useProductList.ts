import { useEffect, useState } from 'react';
import { Product } from '../types';

export const useProductList = () => {
  const [productList, setProductList] = useState<Product[]>([
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 }
  ]);

  useEffect(() => {
    const ENTIRE_DISCOUNT_RATE = 0.2;
    const ONE_SECOND = 1000;

    // Lucky Sale
    const luckySaleTimeout = setTimeout(
      () => {
        const luckySaleInterval = setInterval(() => {
          const luckyItemIndex = Math.floor(Math.random() * productList.length);
          const luckyItem = productList[luckyItemIndex];

          if (Math.random() < 0.3 && luckyItem.stock > 0) {
            setProductList((prevList) =>
              prevList.map((product, index) =>
                index === luckyItemIndex
                  ? {
                      ...product,
                      price: Math.round(product.price * (1 - ENTIRE_DISCOUNT_RATE))
                    }
                  : product
              )
            );
            alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          }
        }, 30 * ONE_SECOND);
      },
      Math.random() * 10 * ONE_SECOND
    );

    // Clean up intervals and timeouts
    return () => {
      clearTimeout(luckySaleTimeout);
    };
  }, [productList]);

  const decreaseStock = (productId: string, amount: number) => {
    // 상태 업데이트를 위한 함수
    setProductList((prevList) =>
      prevList.map((product) => (product.id === productId ? { ...product, stock: product.stock - amount } : product))
    );
  };

  const increaseStock = (productId: string, amount: number) => {
    // 상태 업데이트를 위한 함수
    setProductList((prevList) =>
      prevList.map((product) => (product.id === productId ? { ...product, stock: product.stock + amount } : product))
    );
  };

  return { productList, decreaseStock, increaseStock };
};
