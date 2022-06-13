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
  const { name, images, price, status } = product;
  const linkTo = `${PATH_DASHBOARD.eCommerce.root}/product/${paramCase(name)}`;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    console.log(open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function downloadImage(url: string, name: string) {
    fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('An error sorry'));
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
    </Card>
  );
}
