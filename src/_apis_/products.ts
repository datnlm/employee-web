import axios from 'axios';

export class ShopManager {
  // get list account
  getListProduct = (SiteId: String, page_number: number, page_size: number) =>
    axios
      .get('/api/v1/employee/products', {
        params: { SiteId, page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);

  getListOrder = (GroupId: string, SiteId: string, page_number: number, page_size: number) =>
    axios
      .get('/api/v1/employee/orders', {
        params: { GroupId, SiteId, page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);

  getListOrderDetail = (SiteId: String, id: string, page_number: number, page_size: number) =>
    axios
      .get(`/api/v1/employee/orders/${id}`, {
        params: { SiteId, page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);

  // create
  createOrder = (checkout: any) =>
    axios
      .post('/api/v1/employee/orders', checkout)
      .then((response) => response)
      .catch((err) => err);

  cancel = (orderId: string, description: string) =>
    axios
      .post(`/api/v1/employee/orders/cancel?id=${orderId}&note=${description}`)
      .then((response) => response)
      .catch((err) => err);

  delete = (orderId: string) =>
    axios
      .post(`/api/v1/employee/orders/${orderId}`)
      .then((response) => response)
      .catch((err) => err);
}
export const manageShop = new ShopManager();
