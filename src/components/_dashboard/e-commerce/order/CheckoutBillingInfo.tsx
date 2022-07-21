import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import { Card, Button, Typography, CardHeader, CardContent } from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// @types
import { Customer, ProductState } from '../../../../@types/products';
// redux
import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

type CheckoutBillingInfoProps = {
  customer?: Customer | null;
};

export default function CheckoutBillingInfo({ customer }: CheckoutBillingInfoProps) {
  const { translate } = useLocales();
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title={translate('label.billing-information')} />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {customer?.name}
        </Typography>

        <Typography variant="body2" gutterBottom>
          {customer?.email}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {customer?.phone}
        </Typography>
      </CardContent>
    </Card>
  );
}
