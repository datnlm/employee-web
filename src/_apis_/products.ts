import axios from 'axios';

export class ShopManager {
  // get list account
  getListProduct = (page_number: number, page_size: number) => {
    const SiteId = 1;
    return axios
      .get('/api/v1/employee/products', {
        params: { SiteId, page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // create diver
  createOrder = (checkout: any) =>
    axios
      .post('/api/v1/employee/orders', checkout)
      .then((response) => response)
      .catch((err) => err);
}
export const manageShop = new ShopManager();
