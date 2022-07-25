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
  startTime: Date;
  endTime: Date;
  licensePlate: string;
  note: string;
  siteId: string;
  status: any;
  personalRate: string;
  contribution: string;
  employeePartnerId: any;
  contributionMembers: Contribution[] | null;
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
