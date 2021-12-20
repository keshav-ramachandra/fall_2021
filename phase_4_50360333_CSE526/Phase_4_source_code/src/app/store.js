import { configureStore } from '@reduxjs/toolkit';
import OrgReducer from '../features/OrgUpdater/OrgSlice';

export const store = configureStore({
  reducer: {
    org: OrgReducer,
  },
});
