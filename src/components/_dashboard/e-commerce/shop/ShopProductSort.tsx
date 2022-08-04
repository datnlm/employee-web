import { Icon } from '@iconify/react';
import { useState } from 'react';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { Menu, Button, MenuItem, Typography } from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { sortByProducts } from '../../../../redux/slices/product';
// @types
import { ProductState } from '../../../../@types/products';
// ----------------------------------------------------------------------

export default function ShopProductSort() {
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const { sortBy } = useSelector((state: { product: ProductState }) => state.product);

  const handleOpen = (currentTarget: HTMLButtonElement) => {
    setOpen(currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortBy = (value: string) => {
    handleClose();
    dispatch(sortByProducts(value));
  };

  const SORT_BY_OPTIONS = [
    { value: 'priceDesc', label: translate('label.high-low') },
    { value: 'priceAsc', label: translate('label.low-high') }
  ];

  function renderLabel(label: string | null) {
    if (label === 'priceDesc') {
      return translate('label.high-low');
    }
    return translate('label.low-high');
  }

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={(event) => handleOpen(event.currentTarget)}
        endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        {translate('label.sort')}:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {renderLabel(sortBy)}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sortBy}
            onClick={() => handleSortBy(option.value)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
