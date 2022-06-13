import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import { Card, Button, Typography, CardHeader, CardContent } from '@material-ui/core';
// @types
import { ProductState } from '../../../../@types/products';
// redux
import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

export default function CheckoutBillingInfo() {
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);
  const { billing } = checkout;

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Billing Information" />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {billing?.name}
        </Typography>

        <Typography variant="body2" gutterBottom>
          {billing?.email}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {billing?.phone}
        </Typography>
      </CardContent>
    </Card>
  );
}
