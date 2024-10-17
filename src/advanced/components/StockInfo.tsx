import React from 'react';
import { useProductList } from '../hooks/useProductList';

export const StockInfo: React.FC = () => {
  const { productList } = useProductList();

  const lowStockProducts = productList.filter((product) => product.stock < 5);

  return (
    <div className="text-sm text-gray-500 mt-2">
      {lowStockProducts.length > 0 ? (
        lowStockProducts.map((product) => (
          <p key={product.id}>
            {product.name}: {product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}
          </p>
        ))
      ) : (
        <p>재고가 충분합니다.</p>
      )}
    </div>
  );
};
