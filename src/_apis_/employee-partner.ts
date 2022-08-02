import axios from 'axios';

// Get employee partner
export const getEmployeePartner = (SiteId: String, page_number: number, page_size: number) =>
  axios
    .get('/api/v1/employee-partner/employee-partners', {
      params: { SiteId, page_number, page_size }
    })
    .then((res) => res)
    .catch((err) => err);
