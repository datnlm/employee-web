import axios from 'axios';
import { Group } from '../@types/group';

export const getGroup = (SiteId: string, page_number: number, page_size: number) =>
  axios
    .get(`/api/v1/employee/groups`, {
      params: { SiteId, page_number, page_size }
    })
    .then((res) => res)
    .catch((err) => err);

export const getGroupMode = (page_number: number, page_size: number) =>
  axios
    .get(`/api/v1/employeepartner/group-modes`, {
      params: { page_number, page_size }
    })
    .then((res) => res)
    .catch((err) => err);

export const getGroupRole = (GroupModeId: string, page_number: number, page_size: number) =>
  axios
    .get(`/api/v1/employee/groups`, {
      params: { GroupModeId, page_number, page_size }
    })
    .then((res) => res)
    .catch((err) => err);

export const getGroupById = (groupId: string) =>
  axios
    .get(`/api/v1/employee/groups/${groupId}`)
    .then((res) => res)
    .catch((err) => err);

export const getContribution = (page_number: number, page_size: number) =>
  axios
    .get(`/api/v1/emoloyeepartner/contribution-members`, {
      params: { page_number, page_size }
    })
    .then((res) => res)
    .catch((err) => err);

export const createGroup = (group: Group) => {
  const data = {
    startTime: group.startTime,
    endTime: group.endTime,
    licensePlate: group.licensePlate,
    note: group.note,
    siteId: group.siteId,
    contributionMembers: [group.contributionMembers]
  };
  return axios
    .post('/api/v1/employeepartner/groups', data)
    .then((response) => response)
    .catch((err) => err);
};

export const updateGroup = (group: Group) => {
  const data = {
    id: group.id,
    startTime: group.startTime,
    endTime: group.endTime,
    licensePlate: group.licensePlate,
    note: group.note,
    siteId: group.siteId,
    status: group.status,
    contributionMembers: group.contributionMembers
  };
  return axios
    .post('/api/v1/employeepartner/groups', data)
    .then((response) => response)
    .catch((err) => err);
};
