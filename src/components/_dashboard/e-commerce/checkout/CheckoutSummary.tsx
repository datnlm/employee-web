import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment
} from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// ----------------------------------------------------------------------

const RowStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

type CheckoutSummaryProps = {
  total: number;
  discount?: number;
  subtotal: number;
  shipping?: number;
  onEdit?: VoidFunction;
  enableEdit?: boolean;
  onApplyDiscount?: (discount: number) => void;
  enableDiscount?: boolean;
};

export default function CheckoutSummary({
  total,
  onEdit,
  discount,
  subtotal,
  shipping,
  onApplyDiscount,
  enableEdit = false,
  enableDiscount = false
}: CheckoutSummaryProps) {
  const displayShipping = shipping !== null ? 'Free' : '-';
  const { translate } = useLocales();
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={translate('form.order-summary')}
        action={
          enableEdit && (
            <Button
              size="small"
              type="button"
              onClick={onEdit}
              startIcon={<Icon icon={editFill} />}
            >
              {translate('button.edit')}
            </Button>
          )
        }
      />

      <CardContent>
        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('form.sub-total')}
          </Typography>
          <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
        </RowStyle>

        <Divider sx={{ mb: 2 }} />

        <RowStyle>
          <Typography variant="subtitle1"> {translate('form.total')}</Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
              {fCurrency(total)}
            </Typography>
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              {translate('form.vat')}
            </Typography>
          </Box>
        </RowStyle>
      </CardContent>
    </Card>
  );
}
