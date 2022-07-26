import axios from 'axios';
import employeePartner from 'redux/slices/employee-partner';
import { Contribution, Group } from '../@types/group';

export const getGroup = (SiteId: string, page_number: number, page_size: number) =>
  axios
    .get(`/api/v1/employee/groups`, {
      params: { SiteId, page_number, page_size }
    })
    .then((res) => res)
    .catch((err) => err);

export const getGroupMode = (page_number: number, page_size: number) =>
  axios
    .get(`/api/v1/employee-partner/group-modes`, {
      params: { page_number, page_size }
    })
    .then((res) => res)
    .catch((err) => err);

export const getGroupRole = (GroupModeId: string, page_number: number, page_size: number) =>
  axios
    .get(`/api/v1/employee-partner/group-roles`, {
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
    .get(`/api/v1/employee-partner/contribution-members`, {
      params: { page_number, page_size }
    })
    .then((res) => res)
    .catch((err) => err);

export const createGroup = (group: Group) => {
  const contribution: {
    groupId: string;
    contribution: string;
    personalRate: string;
    employeePartnerId: any;
    employeePartnerName: string;
    groupRoleId: any;
    groupModeId: any;
  }[] = [];
  group.contributionMembers.map((v: Contribution) =>
    contribution.push({
      groupId: v.groupId,
      contribution: v.contribution,
      personalRate: v.personalRate,
      employeePartnerId: v.employeePartnerId,
      employeePartnerName: v.employeePartnerName,
      groupRoleId: v.groupRoleId,
      groupModeId: v.groupModeId
    })
  );
  const data = {
    startTime: group.startTime,
    licensePlate: group.licensePlate,
    note: group.note,
    siteId: group.siteId,
    contributionMembers: contribution
  };
  return axios
    .post('/api/v1/employee-partner/groups', data)
    .then((response) => response)
    .catch((err) => err);
};

export const updateGroup = (group: Group) => {
  const contribution: any[] = [];
  group.contributionMembers.map((v: Contribution) => {
    console.log(v.id);
    console.log(v.id == null);
    if (v.id != '') {
      contribution.push({
        id: v.id,
        groupId: v.groupId,
        contribution: v.contribution,
        personalRate: v.personalRate,
        employeePartnerId: v.employeePartnerId,
        employeePartnerName: v.employeePartnerName,
        groupRoleId: v.groupRoleId,
        groupModeId: v.groupModeId
      });
    } else {
      contribution.push({
        groupId: v.groupId,
        contribution: v.contribution,
        personalRate: v.personalRate,
        employeePartnerId: v.employeePartnerId,
        employeePartnerName: v.employeePartnerName,
        groupRoleId: v.groupRoleId,
        groupModeId: v.groupModeId
      });
    }
  });
  const data = {
    id: group.id,
    startTime: group.startTime,
    endTime: group.endTime,
    licensePlate: group.licensePlate,
    note: group.note,
    siteId: group.siteId,
    status: group.status,
    contributionMembers: contribution
  };
  return axios
    .put('/api/v1/employee-partner/groups', data)
    .then((response) => response)
    .catch((err) => err);
};
