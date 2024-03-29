import { FormikProps } from 'formik';

// ----------------------------------------------------------------------

export type PaymentType = 'momo' | 'cash';

export type ProductStatus = 'sale' | 'new' | '';

export type ProductInventoryType = 'in_stock' | 'out_of_stock' | 'low_stock';

export type ProductCategory = 'Accessories' | 'Apparel' | 'Shoes';

export type ProductGender = 'Men' | 'Women' | 'Kids';

export type OnCreateBilling = (customer: Customer) => void;

export type FormikPropsShopView = FormikProps<ProductFilter>;

export type ProductRating = {
  name: string;
  starCount: number;
  reviewCount: number;
};

export type ProductReview = {
  id: string;
  name: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  isPurchased: boolean;
  helpful: number;
  postedAt: Date;
};

export type Product = {
  id: string;
  cover: string;
  images: string[];
  name: string;
  price: number;
  code: string;
  sku: string;
  tags: String[];
  priceSale: number | null;
  totalRating: number;
  totalReview: number;
  ratings: ProductRating[];
  reviews: ProductReview[];
  colors: string[];
  status: ProductStatus;
  inventoryType: ProductInventoryType;
  sizes: string[];
  available: number;
  description: string;
  sold: number;
  createdAt: Date;
  category: ProductCategory;
  gender: ProductGender;
};

export type CartItem = {
  id: string;
  name: string;
  cover: string;
  available: number;
  price: number;
  color: string;
  size: string;
  quantity: number;
  subtotal: number;
};

export type BillingAddress = {
  receiver: string;
  phone: string;
  fullAddress: string;
  addressType: string;
  isDefault: boolean;
};

export type ProductState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  products: ProductCoralPark[];
  product: ProductCoralPark | null;
  orderDetail: OrderDetail[];
  sortBy: string | null;
  filters: {
    gender: string[];
    category: string;
    colors: string[];
    priceRange: string;
    rating: string;
  };
  checkout: {
    activeStep: number;
    cart: CartItem[];
    subtotal: number;
    total: number;
    discount: number;
    shipping: number;
    billing: Customer | null;
    groupId: string | null;
  };
};

export type ProductFilter = {
  gender: string[];
  category: string;
  colors: string[];
  priceRange: string;
  rating: string;
};

export type PaymentFormikProps = FormikProps<{
  delivery: number;
  payment: string;
}>;

export type DeliveryOption = {
  value: number;
  title: string;
  description: string;
};

export type PaymentOption = {
  value: PaymentType;
  title: string;
  description: string;
  icons: string[];
};

export type CardOption = {
  value: string;
  label: string;
};

export type Invoice = {
  id: string;
  taxes: number;
  discount: number;
  status: string;
  invoiceFrom: {
    name: string;
    address: string;
    company: string;
    email: string;
    phone: string;
  };
  invoiceTo: {
    name: string;
    address: string;
    company: string;
    email: string;
    phone: string;
  };
  items: {
    id: string;
    title: string;
    description: string;
    qty: number;
    price: number;
  }[];
};

// -------------------------------------------------
export type ProductCoralPark = {
  id: string;
  name: string;
  images: any;
  price: number;
  quantity: number;
  description: string;
  mediaUrl: any;
  siteId: string;
  categoryId: string;
  categoryName: string;
  status: string;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
  nationality: any;
};

export type Order = {
  id: string;
  price: string;
  productId: string;
  productImageUrl: string;
  productMedia: string;
  productName: string;
  quantity: string;
};

export type OrderDetail = {
  id: string;
  createTime: string;
  total: string;
  name: string;
  email: string;
  phone: string;
  nationalityName: string;
  status: string;
  orderDetails: Order[];
};
