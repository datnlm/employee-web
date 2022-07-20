export type Contribution = {
  id: string;
  groupId: string;
  contribution: string;
  personalRate: string;
  employeePartnerId: string;
  employeePaartnerName: string;
  groupRoleId: string;
  groupModeId: string;
};

export type Group = {
  id: string;
  startTime: string;
  endTime: string;
  licensePlate: string;
  note: string;
  siteId: string;
  status: string;
  contributionMembers: Contribution[];
};
