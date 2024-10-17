import { useEffect, useState } from 'react';
import { Product } from '../types';
import {
  DAY_DISCOUNT_RATE,
  ENTIRE_DISCOUNT_RATE,
  LUCKY_SALE_INTERVAL,
  ONE_SECOND,
  SUGGESTION_INTERVAL
} from '../constants/Constants';

/**
 * 제품 목록을 관리하는 커스텀 훅
 * @returns {Object} 제품 목록, 재고 감소 및 증가 함수, 마지막 선택된 제품 ID 설정 함수
 */
export const useProductList = () => {
  const [productList, setProductList] = useState<Product[]>([
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 }
  ]);

  const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null);

  // Lucky Sale 로직
  useEffect(() => {
    // Lucky Sale 시작
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
        }, LUCKY_SALE_INTERVAL);

        return () => clearInterval(luckySaleInterval);
      },
      Math.random() * 10 * ONE_SECOND
    );

    return () => {
      clearTimeout(luckySaleTimeout);
    };
  }, [productList]);

  // 제안 상품 할인 로직
  useEffect(() => {
    const suggestionTimeout = setTimeout(
      () => {
        const suggestionInterval = setInterval(() => {
          if (lastSelectedProductId) {
            const suggestion = productList.find((item) => item.id !== lastSelectedProductId && item.stock > 0);
            if (suggestion) {
              setProductList((prevList) =>
                prevList.map((product) =>
                  product.id === suggestion.id
                    ? {
                        ...product,
                        price: Math.round(product.price * (1 - DAY_DISCOUNT_RATE))
                      }
                    : product
                )
              );
              alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 ${DAY_DISCOUNT_RATE * 100}% 추가 할인!`);
            }
          }
        }, SUGGESTION_INTERVAL);

        return () => clearInterval(suggestionInterval);
      },
      Math.random() * 20 * ONE_SECOND
    );

    return () => {
      clearTimeout(suggestionTimeout);
    };
  }, [lastSelectedProductId, productList]);

  /**
   * 제품의 재고를 감소시키는 함수
   * @param {string} productId - 재고를 감소시킬 제품의 ID
   * @param {number} amount - 감소할 수량
   */
  const decreaseStock = (productId: string, amount: number) => {
    setProductList((prevList) =>
      prevList.map((product) => (product.id === productId ? { ...product, stock: product.stock - amount } : product))
    );
  };

  /**
   * 제품의 재고를 증가시키는 함수
   * @param {string} productId - 재고를 증가시킬 제품의 ID
   * @param {number} amount - 증가할 수량
   */
  const increaseStock = (productId: string, amount: number) => {
    setProductList((prevList) =>
      prevList.map((product) => (product.id === productId ? { ...product, stock: product.stock + amount } : product))
    );
  };

  return { productList, decreaseStock, increaseStock, setLastSelectedProductId };
};
