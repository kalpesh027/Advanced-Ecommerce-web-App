import { createSelector } from 'reselect';

// Input selector: extracts the orders part of the state
const selectOrdersState = (state) => state.orders;

// Memoized selector: computes the orders if they change
export const selectOrders = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.orders
);
