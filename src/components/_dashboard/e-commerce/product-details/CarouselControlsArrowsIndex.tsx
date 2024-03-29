import { Icon } from '@iconify/react';
import arrowLeftFill from '@iconify/icons-eva/arrow-left-fill';
import arrowRightFill from '@iconify/icons-eva/arrow-right-fill';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { Typography, Box, BoxProps } from '@material-ui/core';
import { MIconButton } from 'components/@material-extend';
//
// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  zIndex: 9,
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[900], 0.48)
}));

const ArrowStyle = styled(MIconButton)(({ theme }) => ({
  padding: 6,
  opacity: 0.48,
  color: theme.palette.common.white,
  '&:hover': { opacity: 1 }
}));

// ----------------------------------------------------------------------

interface CarouselControlsArrowsIndexProps extends BoxProps {
  index: number;
  total: number;
  onNext?: VoidFunction;
  onPrevious?: VoidFunction;
}

export default function CarouselControlsArrowsIndex({
  index,
  total,
  onNext,
  onPrevious,

  ...other
}: CarouselControlsArrowsIndexProps) {
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

  return (
    <RootStyle {...other}>
      <ArrowStyle size="small" onClick={onPrevious}>
        <Icon width={20} height={20} icon={isRTL ? arrowRightFill : arrowLeftFill} />
      </ArrowStyle>

      <Typography variant="subtitle2">
        {index + 1}/{total}
      </Typography>

      <ArrowStyle size="small" onClick={onNext}>
        <Icon width={20} height={20} icon={isRTL ? arrowLeftFill : arrowRightFill} />
      </ArrowStyle>
    </RootStyle>
  );
}
