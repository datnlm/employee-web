import { createSlice } from '@reduxjs/toolkit';
import { sum, map, filter, uniqBy, sample } from 'lodash';
import faker from 'faker';
import { paramCase } from 'change-case';
import { mockImgProduct } from 'utils/mockImages';
import { getEmployeePartner } from '_apis_/employee-partner';
import { store, dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { EmployeePartner } from '../../@types/employee-partner';

// ----------------------------------------------------------------------
type EmployeePartnerState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  employeePartnerList: EmployeePartner[];
};
const initialState: EmployeePartnerState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  employeePartnerList: []
};

const slice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // TOTOAL COUNT
    totalCount(state, action) {
      state.totalCount = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getEmployeePartnerSuccess(state, action) {
      state.isLoading = false;
      state.employeePartnerList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getEmployeePartnerList(page: number, rowPerpage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await getEmployeePartner(1 + page, rowPerpage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getEmployeePartnerSuccess(response.data.items));
        } else {
          dispatch(slice.actions.getEmployeePartnerSuccess([]));
        }
      });
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
