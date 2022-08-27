import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { paramCase, sentenceCase } from 'change-case';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
// material
import { Box, Grid, Step, Stepper, Container, StepLabel, StepConnector } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import useLocales from 'hooks/useLocales';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCart, createBilling } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
// @types
import { ProductState } from '../../@types/products';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  CheckoutCart,
  CheckoutPayment,
  CheckoutBillingInformation
} from '../../components/_dashboard/e-commerce/checkout';

// ----------------------------------------------------------------------

const QontoConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)'
  },
  active: {
    '& $line': { borderColor: theme.palette.primary.main }
  },
  completed: {
    '& $line': { borderColor: theme.palette.primary.main }
  },
  line: {
    borderTopWidth: 2,
    borderColor: theme.palette.divider
  }
}))(StepConnector);

function QontoStepIcon({ active, completed }: { active: boolean; completed: boolean }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'divider',
        bgcolor: 'background.default'
      }}
    >
      {completed ? (
        <Box
          component={Icon}
          icon={checkmarkFill}
          sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }}
        />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor'
          }}
        />
      )}
    </Box>
  );
}

export default function EcommerceCheckout() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const STEPS = [
    translate('form.cart'),
    translate('label.billing-information'),
    translate('button.checkout')
  ];

  const isMountedRef = useIsMountedRef();
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);
  const { cart, billing, activeStep } = checkout;
  const isComplete = activeStep === STEPS.length;
  const { pathname } = useLocation();
  const { name } = useParams();

  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(getCart(cart));
    }
  }, [dispatch, isMountedRef, cart]);

  useEffect(() => {
    if (activeStep === 1) {
      dispatch(createBilling(null));
    }
  }, [dispatch, activeStep]);

  return (
    <Page title={translate('label.ecommerce')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('button.checkout')}
          links={[
            { name: translate('page.group.heading2'), href: PATH_DASHBOARD.eCommerce.group },
            {
              name: translate('page.order.heading3'),
              href: `${PATH_DASHBOARD.eCommerce.root}/order/${paramCase(name)}/`
            },
            {
              name: translate('page.order.heading4.product'),
              href: `${PATH_DASHBOARD.eCommerce.root}/order/${paramCase(name)}/shop`
            },
            { name: translate('button.checkout') }
          ]}
        />

        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>
        <>
          {activeStep === 0 && <CheckoutCart />}
          {activeStep === 1 && <CheckoutBillingInformation />}
          {activeStep === 2 && billing && <CheckoutPayment />}
        </>
      </Container>
    </Page>
  );
}
