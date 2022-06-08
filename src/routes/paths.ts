// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}
const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/';

// ----------------------------------------------------------------------
export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    pageOne: path(ROOTS_DASHBOARD, '/one'),
    pageTwo: path(ROOTS_DASHBOARD, '/two'),
    pageThree: path(ROOTS_DASHBOARD, '/three')
  },
  app: {
    root: path(ROOTS_DASHBOARD, '/app'),
    pageFour: path(ROOTS_DASHBOARD, '/app/four'),
    pageFive: path(ROOTS_DASHBOARD, '/app/five'),
    pageSix: path(ROOTS_DASHBOARD, '/app/six')
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/dashboard/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/dashboard/e-commerce/shop'),
    product: path(ROOTS_DASHBOARD, '/dashboard/e-commerce/product/:name'),
    productById: path(ROOTS_DASHBOARD, '/dashboard/e-commerce/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/dashboard/e-commerce/list'),
    newProduct: path(ROOTS_DASHBOARD, '/dashboard/e-commerce/product/new'),
    editById: path(
      ROOTS_DASHBOARD,
      '/dashboard/e-commerce/product/nike-blazer-low-77-vintage/edit'
    ),
    checkout: path(ROOTS_DASHBOARD, '/dashboard/e-commerce/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/dashboard/e-commerce/invoice')
  }
};
