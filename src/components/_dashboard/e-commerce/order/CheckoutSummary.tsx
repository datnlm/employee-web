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
  total?: string;
};

export default function CheckoutSummary({ total }: CheckoutSummaryProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Order Summary" />

      <CardContent>
        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sub Total
          </Typography>
          {total && <Typography variant="subtitle2">{fCurrency(Number(total))}</Typography>}
        </RowStyle>

        <Divider sx={{ mb: 2 }} />

        <RowStyle>
          <Typography variant="subtitle1">Total</Typography>
          <Box sx={{ textAlign: 'right' }}>
            {total && (
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(Number(total))}
              </Typography>
            )}

            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              (VAT included if applicable)
            </Typography>
          </Box>
        </RowStyle>
      </CardContent>
    </Card>
  );
}
