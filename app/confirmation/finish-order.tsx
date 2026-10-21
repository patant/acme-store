'use client';
// A page cannot write cookies while it renders, so the cart is dropped from here.
import { useEffect } from 'react';
import { finishOrder } from '../actions';

export function FinishOrder() {
  useEffect(() => {
    finishOrder();
  }, []);
  return null;
}
