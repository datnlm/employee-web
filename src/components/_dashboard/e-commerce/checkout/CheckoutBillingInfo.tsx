import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import { Card, Button, Typography, CardHeader, CardContent } from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// @types
import { ProductState } from '../../../../@types/products';
// redux
import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

type CheckoutBillingInfoProps = {
  onBackStep: VoidFunction;
};

export default function CheckoutBillingInfo({ onBackStep }: CheckoutBillingInfoProps) {
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);
  const { billing } = checkout;
  const { translate } = useLocales();
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={translate('label.billing-information')}
        action={
          <Button
            size="small"
            type="button"
            startIcon={<Icon icon={editFill} />}
            onClick={onBackStep}
          >
            {translate('button.edit')}
          </Button>
        }
      />
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
