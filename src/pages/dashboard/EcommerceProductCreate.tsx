import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
import { ProductState } from '../../@types/products';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewForm from '../../components/_dashboard/e-commerce/ProductNewForm';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { products } = useSelector((state: { product: ProductState }) => state.product);
  const isEdit = pathname.includes('edit');
  const currentProduct = products.find((product) => paramCase(product.name) === name);

  useEffect(() => {
    dispatch(getProducts(user?.SiteId, 0, -1));
  }, [dispatch]);

  return (
    <Page title="Ecommerce: Create a new product">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root
            },
            { name: !isEdit ? 'New product' : name }
          ]}
        />

        {/* <ProductNewForm isEdit={isEdit} currentProduct={currentProduct} /> */}
      </Container>
    </Page>
  );
}
