// material
import { Skeleton, Grid } from '@material-ui/core';
import PhotoCard from './PhotoCard';
import { Product, ProductCoralPark } from '../../../../@types/products';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(12)].map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

type PhotoListProps = {
  products: ProductCoralPark[];
  isLoad: boolean;
};

export default function PhotoList({ products, isLoad, ...other }: PhotoListProps) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <PhotoCard product={product} />
        </Grid>
      ))}

      {isLoad && SkeletonLoad}
    </Grid>
  );
}
