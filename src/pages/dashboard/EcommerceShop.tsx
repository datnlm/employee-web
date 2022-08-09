import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { filter, includes, orderBy } from 'lodash';
import { paramCase, sentenceCase } from 'change-case';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
// material
import { Backdrop, Container, Typography, CircularProgress, Stack } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { momoPayment } from '_apis_/momo';
import { manageShop } from '_apis_/products';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, filterProducts, resetCart } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { Product, ProductState, ProductFilter, ProductCoralPark } from '../../@types/products';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar
} from '../../components/_dashboard/e-commerce/shop';
import CartWidget from '../../components/_dashboard/e-commerce/CartWidget';

// ----------------------------------------------------------------------

function applyFilter(products: ProductCoralPark[], sortBy: string | null, filters: ProductFilter) {
  // function applyFilter(products: Product[], sortBy: string | null, filters: ProductFilter) {
  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  // if (filters.gender.length > 0) {
  //   products = filter(products, (_product) => includes(filters.gender, _product.gender));
  // }
  if (filters.category !== 'All') {
    products = filter(products, (_product) => _product.categoryName === filters.category);
  }
  // if (filters.colors.length > 0) {
  //   products = filter(products, (_product) =>
  //     _product.colors.some((color) => filters.colors.includes(color))
  //   );
  // }
  if (filters.priceRange) {
    products = filter(products, (_product) => {
      if (filters.priceRange === 'below') {
        return _product.price < 25;
      }
      if (filters.priceRange === 'between') {
        return _product.price >= 25 && _product.price <= 75;
      }
      return _product.price > 75;
    });
  }
  // if (filters.rating) {
  //   products = filter(products, (_product) => {
  //     const convertRating = (value: string) => {
  //       if (value === 'up4Star') return 4;
  //       if (value === 'up3Star') return 3;
  //       if (value === 'up2Star') return 2;
  //       return 1;
  //     };
  //     return _product.totalRating > convertRating(filters.rating);
  //   });
  // }
  return products;
}

export default function EcommerceShop() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { pathname, search } = useLocation();
  const { name } = useParams();
  const [openFilter, setOpenFilter] = useState(false);
  const { products, sortBy, filters, isLoading } = useSelector(
    (state: { product: ProductState }) => state.product
  );

  const filteredProducts = applyFilter(products, sortBy, filters);

  const formik = useFormik<ProductFilter>({
    initialValues: {
      gender: filters.gender,
      category: filters.category,
      colors: filters.colors,
      priceRange: filters.priceRange,
      rating: filters.rating
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { values, resetForm, handleSubmit, isSubmitting, initialValues } = formik;

  useEffect(() => {
    const data = search.split('&');
    // const data = window.location.search.split('&');
    if (data[2] != null) {
      const errorCode = data[11].split('=')[1];
      const orderId = data[4].split('=')[1];
      if (errorCode == '0') {
        enqueueSnackbar(translate('message.order-success'), {
          variant: 'success'
        });
        dispatch(resetCart());
        momoPayment(data);
      } else {
        enqueueSnackbar(translate('message.order-error'), {
          variant: 'error'
        });
        manageShop.delete(orderId);
      }
    }
    console.log('pathname');
    console.log(data);
    dispatch(getProducts(user?.SiteId, 0, -1));
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  return (
    <Page title="Ecommerce | CPMS">
      {values && (
        <Backdrop open={isSubmitting} sx={{ zIndex: 9999 }}>
          <CircularProgress />
        </Backdrop>
      )}

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.order.heading1.product')}
          links={[
            { name: translate('page.group.heading2'), href: PATH_DASHBOARD.eCommerce.group },
            {
              name: translate('page.order.heading3'),
              href: `${PATH_DASHBOARD.eCommerce.root}/order/${paramCase(name)}/`
            },
            { name: translate('page.order.heading4.product') }
          ]}
        />
        {!isLoading && products.length == 0 && (
          <Typography gutterBottom>
            <Typography component="span" variant="subtitle1">
              {filteredProducts.length}
            </Typography>
            &nbsp;{translate('label.not-found')}
          </Typography>
        )}

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <ShopTagFiltered
            filters={filters}
            formik={formik}
            isShowReset={openFilter}
            onResetFilter={handleResetFilter}
          />

          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ShopFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ShopProductSort />
          </Stack>
        </Stack>

        <ShopProductList products={filteredProducts} isLoad={isLoading} />
        <CartWidget />
      </Container>
    </Page>
  );
}
