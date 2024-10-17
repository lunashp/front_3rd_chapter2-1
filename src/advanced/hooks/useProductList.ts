import { useState } from 'react';
import { Product } from '../types';

export const useProductList = () => {
  const [productList, setProductList] = useState<Product[]>([
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 }
  ]);

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
