import { useState } from 'react';
import { DISCOUNT_RATES } from '../constants/Constants';

/**
 * 할인 및 보너스 포인트 계산 관련 훅
 * @returns {object} 할인 및 보너스 포인트 관련 함수와 상태
 */
export const useDiscount = () => {
  const [bonusPoints, setBonusPoints] = useState(0);

  /**
   * 상품에 대한 할인율을 가져오는 함수
   * @param {string} productId 상품의 ID
   * @param {number} quantity 상품의 수량
   * @returns {number}
   */
  const getDiscountRate = (productId: string, quantity: number) => {
    return quantity >= 10 ? DISCOUNT_RATES[productId] || 0 : 0;
  };

  /**
   * 할인을 적용하는 함수
   * @param {number} subTotal - 기본 금액
   * @param {number} itemCount - 장바구니 아이템 수
   * @returns {number}
   */
  function applyDiscounts(subTotal: number, itemCount: number): number {
    let totalAmount = subTotal;

    // 대량 구매 할인 적용
    if (itemCount >= 30) {
      totalAmount = Math.min(totalAmount, subTotal * 0.75);
    }

    // 화요일 할인 적용
    if (new Date().getDay() === 2) {
      totalAmount *= 0.9;
    }

    return totalAmount;
  }

  /**
   * 총 금액에 기반하여 보너스 포인트를 계산하는 함수
   * @param {number} totalAmount - 총 금액
   * @returns {number}
   */
  const calculateBonusPoints = (totalAmount: number): number => {
    return Math.floor(totalAmount / 1000);
  };

  /**
   * 총 금액에 기반하여 보너스 포인트를 업데이트하는 함수
   * @param {number} totalAmount - 총 금액
   * @returns {void}
   */
  const updateBonusPoints = (totalAmount: number) => {
    const points = calculateBonusPoints(totalAmount);
    setBonusPoints((prevPoints) => prevPoints + points);
  };

  return {
    getDiscountRate,
    calculateBonusPoints,
    updateBonusPoints,
    applyDiscounts,
    bonusPoints
  };
};
