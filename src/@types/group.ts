export type Contribution = {
  id: string;
  groupId: string;
  contribution: string;
  personalRate: string;
  employeePartnerId: any;
  employeePartnerName: string;
  groupRoleId: any;
  groupModeId: any;
};

export type Group = {
  id: string;
  startTime: string;
  endTime: string;
  licensePlate: string;
  note: string;
  siteId: string;
  status: any;
  groupRoleId: string;
  personalRate: string;
  contribution: string;
  employeePartnerId: any;
  contributionMembers: Contribution[];
};

export type GroupMode = {
  id: string;
  name: string;
  contribution: string;
};

export type GroupRole = {
  id: string;
  name: string;
  personalRate: string;
  partnerRate: string;
  groupModeId: string;
  groupModeName: string;
  groupModeContribution: string;
};
