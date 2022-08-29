import { useState } from 'react';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
// material
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  Grid,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider
} from '@material-ui/core';
import minusFill from '@iconify/icons-eva/minus-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import { styled } from '@material-ui/core/styles';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
// redux
import { MIconButton } from 'components/@material-extend';
import useLocales from 'hooks/useLocales';
import { useDispatch, useSelector } from '../../../../redux/store';
import { addCart, onGotoStep } from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
//
import Label from '../../../Label';
import ColorPreview from '../../../ColorPreview';

import { Product, ProductCoralPark } from '../../../../@types/products';
// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')(({ theme }) => ({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
}));

// ----------------------------------------------------------------------

type ShopProductCardProps = {
  product: ProductCoralPark;
};

export default function ShopProductCard({ product }: ShopProductCardProps) {
  // const { name, cover, price, colors, status, priceSale, available } = product;
  const { name, images, price, status, quantity } = product;
  const linkTo = `${PATH_DASHBOARD.eCommerce.root}/product/${paramCase(name)}`;
  const { translate } = useLocales();
  let quantityProduct = 1;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    console.log(open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Incrementer = ({ name, available }: { name: string; available: number }) => {
    const [value, setValue] = useState<number>(1);
    const incrementQuantity = () => {
      setValue(value + 1);
      quantityProduct = value + 1;
    };
    const decrementQuantity = () => {
      setValue(value - 1);
      quantityProduct = value - 1;
    };

    return (
      <Box
        sx={{
          py: 0.5,
          px: 0.75,
          border: 1,
          lineHeight: 0,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          borderColor: 'grey.50032'
        }}
      >
        <MIconButton size="small" color="inherit" disabled={value == 1} onClick={decrementQuantity}>
          <Icon icon={minusFill} width={16} height={16} />
        </MIconButton>
        <Typography
          variant="body2"
          component="span"
          sx={{
            width: 40,
            textAlign: 'center',
            display: 'inline-block'
          }}
        >
          {value}
        </Typography>
        <MIconButton
          size="small"
          color="inherit"
          disabled={quantity != null ? value >= available : false}
          onClick={incrementQuantity}
        >
          <Icon icon={plusFill} width={16} height={16} />
        </MIconButton>
      </Box>
    );
  };

  const handleAddCart = async () => {
    try {
      setOpen(false);
      console.log(product);
      const data = {
        id: product.id,
        name: product.name,
        cover: product.images[0].imageUrl,
        // available: product.available,
        price: product.price,
        color: 'BLue',
        size: 'Size',
        quantity: quantityProduct,
        subtotal: quantityProduct * product.price
      };
      dispatch(addCart(data));
    } catch (error) {
      console.error(error);
    }
  };

  function FormDialogs() {
    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle> {translate('label.quantity')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Box
                sx={{
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                  {translate('label.quantity')}
                </Typography>

                <div>
                  <Incrementer name="quantity" available={quantity} />
                </div>
              </Box>
              <Divider sx={{ borderStyle: 'dashed' }} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              {translate('button.cancel')}
            </Button>
            <Button onClick={handleAddCart} variant="contained">
              {translate('button.add')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {status}
          </Label>
        )}

        <ProductImgStyle alt={name} src={images ? images[0].imageUrl : null} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
        <Stack direction="row" alignItems="center" justifyContent="right">
          {/* <ColorPreview colors={['colors']} /> */}
          <Typography variant="subtitle1">
            {/* <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through'
              }}
            >
              {11111 && fCurrency(1111)}
            </Typography>  */}
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
          <Button
            fullWidth
            // disabled={available == 0}
            size="large"
            type="button"
            color="warning"
            variant="contained"
            startIcon={<Icon icon={roundAddShoppingCart} />}
            onClick={handleClickOpen}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {translate('button.add')}
          </Button>
          <FormDialogs />
        </Stack>
      </Stack>
    </Card>
  );
}
