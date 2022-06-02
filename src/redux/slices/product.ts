import { createSlice } from '@reduxjs/toolkit';
import { sum, map, filter, uniqBy, sample } from 'lodash';
import faker from 'faker';
import { paramCase } from 'change-case';
import { mockImgProduct } from 'utils/mockImages';

import { store } from '../store';
// utils
import axios from '../../utils/axios';
import { CartItem, Product, ProductState } from '../../@types/products';

// ----------------------------------------------------------------------

const initialState: ProductState = {
  isLoading: false,
  error: false,
  products: [],
  product: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: ''
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null
  }
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(cart.map((cartItem: CartItem) => cartItem.price * cartItem.quantity));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      const product = action.payload;
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, product];
      } else {
        state.checkout.cart = map(state.checkout.cart, (_product) => {
          const isExisted = _product.id === product.id;
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + 1
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, product], 'id');
    },

    deleteCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts
} = slice.actions;

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Nike Air Force 1 NDESTRUKT',
  'Nike Space Hippie 04',
  'Nike Air Zoom Pegasus 37 A.I.R. Chaz Bear',
  'Nike Blazer Low 77 Vintage',
  'Nike ZoomX SuperRep Surge',
  'Zoom Freak 2',
  'Nike Air Max Zephyr',
  'Jordan Delta',
  'Air Jordan XXXV PF',
  'Nike Waffle Racer Crater',
  'Kyrie 7 EP Sisterhood',
  'Nike Air Zoom BB NXT',
  'Nike Air Force 1 07 LX',
  'Nike Air Force 1 Shadow SE',
  'Nike Air Zoom Tempo NEXT%',
  'Nike DBreak-Type',
  'Nike Air Max Up',
  'Nike Air Max 270 React ENG',
  'NikeCourt Royale',
  'Nike Air Zoom Pegasus 37 Premium',
  'Nike Air Zoom SuperRep',
  'NikeCourt Royale',
  'Nike React Art3mis',
  'Nike React Infinity Run Flyknit A.I.R. Chaz Bear'
];
const PRODUCT_COLOR = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107'
];
const PRODUCT_TAGS = ['Dangal', 'The Sting', '2001: A Space Odyssey', "Singin' in the Rain"];
const PRODUCT_CATEGORY = [
  'Shirts',
  'T-shirts',
  'Jeans',
  'Leather',
  'Suits',
  'Blazers',
  'Trousers',
  'Waistcoats',
  'Shoes',
  'Backpacks and bags',
  'Bracelets',
  'Face masks'
];
const PRODUCT_DESCRIPTION = `
<p><strong><small> SPECIFICATION</small></strong></p>
<p>Leather panels. Laces. Rounded toe. Rubber sole.
<br /><br />
<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>
<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>
`;
const PRODUCT_SIZE = ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

export function getProducts() {
  return async () => {
    const { dispatch } = store;
    dispatch(slice.actions.startLoading());
    try {
      const products = [...Array(24)].map((_, index) => {
        const setIndex = index + 1;

        return {
          id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${setIndex}`,
          cover: mockImgProduct(setIndex),
          images: [...Array(8)].map((_, index) => {
            const setIndex = index + 1;
            return mockImgProduct(setIndex);
          }),
          name: PRODUCT_NAME[index],
          code: `38BEE27${setIndex}`,
          sku: `WW75K521${setIndex}YW/SV`,
          tags: PRODUCT_TAGS,
          price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
          priceSale:
            setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29, precision: 0.01 }),
          totalRating: faker.datatype.number({ min: 0, max: 5, precision: 0.1 }),
          totalReview: faker.datatype.number(),
          ratings: [...Array(5)].map((_, index) => ({
            name: `${index + 1} Star`,
            starCount: faker.datatype.number(),
            reviewCount: faker.datatype.number()
          })),
          reviews: [...Array(8)].map((_, index) => ({
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
            comment: faker.lorem.lines(),
            rating: faker.datatype.number({ min: 1, max: 5 }),
            isPurchased: faker.datatype.boolean(),
            helpful: faker.datatype.number({ min: 1, max: 500 }),
            postedAt: faker.date.past()
          })),
          colors:
            (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
            (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
            (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
            (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
            (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
            (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
            PRODUCT_COLOR,
          status: sample(['sale', 'new', '', '']),
          inventoryType: sample(['in_stock', 'out_of_stock', 'low_stock']),
          sizes: PRODUCT_SIZE,
          available: setIndex % 3 === 0 ? faker.datatype.number({ min: 19, max: 100 }) : 2,
          description: PRODUCT_DESCRIPTION,
          sold: faker.datatype.number(),
          createdAt: faker.date.past(),
          category: sample(PRODUCT_CATEGORY),
          gender: sample(['Men', 'Women', 'Kids'])
        };
      });
      // const response: { data: { products: Product[] } } = await axios.get('/api/products');
      dispatch(slice.actions.getProductsSuccess(products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(name: string) {
  return async () => {
    const { dispatch } = store;
    dispatch(slice.actions.startLoading());
    try {
      const products = [...Array(24)].map((_, index) => {
        const setIndex = index + 1;

        return {
          id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${setIndex}`,
          cover: mockImgProduct(setIndex),
          images: [...Array(8)].map((_, index) => {
            const setIndex = index + 1;
            return mockImgProduct(setIndex);
          }),
          name: PRODUCT_NAME[index],
          code: `38BEE27${setIndex}`,
          sku: `WW75K521${setIndex}YW/SV`,
          tags: PRODUCT_TAGS,
          price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
          priceSale:
            setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29, precision: 0.01 }),
          totalRating: faker.datatype.number({ min: 0, max: 5, precision: 0.1 }),
          totalReview: faker.datatype.number(),
          ratings: [...Array(5)].map((_, index) => ({
            name: `${index + 1} Star`,
            starCount: faker.datatype.number(),
            reviewCount: faker.datatype.number()
          })),
          reviews: [...Array(8)].map((_, index) => ({
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
            comment: faker.lorem.lines(),
            rating: faker.datatype.number({ min: 1, max: 5 }),
            isPurchased: faker.datatype.boolean(),
            helpful: faker.datatype.number({ min: 1, max: 500 }),
            postedAt: faker.date.past()
          })),
          colors:
            (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
            (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
            (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
            (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
            (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
            (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
            PRODUCT_COLOR,
          status: sample(['sale', 'new', '', '']),
          inventoryType: sample(['in_stock', 'out_of_stock', 'low_stock']),
          sizes: PRODUCT_SIZE,
          available: setIndex % 3 === 0 ? faker.datatype.number({ min: 19, max: 100 }) : 2,
          description: PRODUCT_DESCRIPTION,
          sold: faker.datatype.number(),
          createdAt: faker.date.past(),
          category: sample(PRODUCT_CATEGORY),
          gender: sample(['Men', 'Women', 'Kids'])
        };
      });
      dispatch(slice.actions.getProductSuccess(products[0]));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
