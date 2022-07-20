import axios from 'axios';

export const getGroupById = (groupId: string) =>
  axios
    .get(`/api/v1/employee/groups/${groupId}`)
    .then((res) => res)
    .catch((err) => err);
