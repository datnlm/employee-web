import axios from 'axios';

// Get employee partner
export const getEmployeePartner = (page_number: number, page_size: number) =>
  axios
    .get(
      `/api/v1/employee-partner/employee-partners?page_number=${page_number}&page_size=${page_size}`
    )
    .then((res) => res)
    .catch((err) => err);
