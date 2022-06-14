// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}
const ROOTS_AUTH = '/auth';
const ROOTS_PHOTO = '/photo';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------
export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify'),
  photo: path(ROOTS_AUTH, '/photo')
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/'),
    shop: path(ROOTS_DASHBOARD, '/shop'),
    product: path(ROOTS_DASHBOARD, '/product/:name'),
    list: path(ROOTS_DASHBOARD, '/list'),
    order: path(ROOTS_DASHBOARD, '/order'),
    orderDetail: path(ROOTS_DASHBOARD, '/order/:name'),
    checkout: path(ROOTS_DASHBOARD, '/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/invoice')
  }
};

export const PATH_PHOTO = {
  root: ROOTS_PHOTO,
  photo: path(ROOTS_PHOTO, '/photo'),
  phone: path(ROOTS_PHOTO, '/:name')
};
