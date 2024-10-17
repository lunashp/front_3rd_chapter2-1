import { useState } from 'react';

export const DISCOUNT_RATES: { [key: string]: number } = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25
};

export const useDiscount = () => {
  const [bonusPoints, setBonusPoints] = useState(0);

  const getDiscountRate = (productId: string, quantity: number) => {
    return quantity >= 10 ? DISCOUNT_RATES[productId] || 0 : 0;
  };

  const applyBulkDiscount = (totalAmount: number, itemCount: number) => {
    if (itemCount >= 30) {
      return totalAmount * 0.75; // Apply 25% discount
    }
    return totalAmount;
  };

  const applyTuesdayDiscount = (totalAmount: number) => {
    const today = new Date().getDay();
    if (today === 2) {
      return totalAmount * 0.9;
    }
    return totalAmount;
  };

  const calculateBonusPoints = (totalAmount: number): number => {
    return Math.floor(totalAmount / 1000);
  };

  const updateBonusPoints = (totalAmount: number) => {
    const points = calculateBonusPoints(totalAmount);
    setBonusPoints((prevPoints) => prevPoints + points);
  };

  return {
    getDiscountRate,
    applyBulkDiscount,
    applyTuesdayDiscount,
    calculateBonusPoints,
    updateBonusPoints, // Expose the update function
    bonusPoints
  };
};
