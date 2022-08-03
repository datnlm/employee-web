import axios from 'axios';
// create
export const createOrderMomo = (checkout: any) =>
  axios
    .post('/api/v1/employee/momo-payments/momo', checkout)
    .then((response) => response)
    .catch((err) => err);

export const momoPayment = (payment: any) => {
  const id = payment[2].split('=')[1];
  const total = payment[3].split('=')[1];
  const orderInfor = payment[5].split('=')[1];
  const error = payment[11].split('=')[1];

  const data = {
    requestId: id,
    errorCode: error,
    orderId: orderInfor,
    amount: total,
    paymentTypeId: 2
  };

  return axios
    .post('/api/v1/employee/momo-payments', data)
    .then((response) => response)
    .catch((err) => err);
};
