import { createSlice } from '@reduxjs/toolkit';
import { sum, map, filter, uniqBy, sample } from 'lodash';
import faker from 'faker';
import { paramCase } from 'change-case';
import { mockImgProduct } from 'utils/mockImages';

import { getContribution, getGroup, getGroupMode, getGroupRole } from '_apis_/group';
import { store, dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { Contribution, Group, GroupMode, GroupRole } from '../../@types/group';

// ----------------------------------------------------------------------
type GroupState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  groupList: Group[];
  groupModeList: GroupMode[];
  groupRoleList: GroupRole[];
  contributionList: Contribution[];
};
const initialState: GroupState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  groupList: [],
  groupModeList: [],
  groupRoleList: [],
  contributionList: []
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
    getGroupsSuccess(state, action) {
      state.isLoading = false;
      state.groupList = action.payload;
    },

    // GET PRODUCTS
    getGroupModeSuccess(state, action) {
      state.isLoading = false;
      state.groupModeList = action.payload;
    },

    // GET PRODUCTS
    getGroupRoleSuccess(state, action) {
      state.isLoading = false;
      state.groupRoleList = action.payload;
    },

    // GET Contribution
    getContributionSuccess(state, action) {
      state.isLoading = false;
      state.contributionList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getGroups(SiteId: string, page: number, rowPerpage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await getGroup(SiteId, 1 + page, rowPerpage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getGroupsSuccess(response.data.items));
        } else {
          dispatch(slice.actions.getGroupsSuccess([]));
        }
      });
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getGroupModeList(page: number, rowPerpage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await getGroupMode(1 + page, rowPerpage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getGroupModeSuccess(response.data.items));
        } else {
          dispatch(slice.actions.getGroupsSuccess([]));
        }
      });
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getGroupRoleList(GroupModeId: string, page: number, rowPerpage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await getGroupRole(GroupModeId, 1 + page, rowPerpage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getGroupRoleSuccess(response.data.items));
        } else {
          dispatch(slice.actions.getGroupsSuccess([]));
        }
      });
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getContributions(page: number, rowPerpage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await getContribution(1 + page, rowPerpage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getContributionSuccess(response.data.items));
        } else {
          dispatch(slice.actions.getContributionSuccess([]));
        }
      });
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
