import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
// utils
import { mockImgProduct } from '../utils/mockImages';

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

// ----------------------------------------------------------------------

const products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  const price = sample([
    {
      currency: 'EUR',
      prices: [9.99, 19.99, 29.99, 30.00, 10.00, 99.99, 100.0]
    },
    {
      currency: 'RUB',
      prices: [1500.00, 1399.99, 1999.99, 2999.99, 4000.0, 799.99]
    },
    {
      currency: 'RUB',
      prices: [1500.00, 1399.99, 1999.99, 2999.99, 4000.0, 799.99]
    },
    {
      currency: 'RUB',
      prices: [1500.00, 1399.99, 1999.99, 2999.99, 4000.0, 799.99]
    },
    {
      currency: 'RUB',
      prices: [1500.00, 1399.99, 1999.99, 2999.99, 4000.0, 799.99]
    },
    {
      currency: 'USD',
      prices: [9.99, 19.99, 29.99, 30.00, 10.00, 99.99, 100.0, 999.99, 599.99]
    }
  ]);

  return {
    id: faker.datatype.uuid(),
    cover: mockImgProduct(setIndex),
    name: PRODUCT_NAME[index],
    shortName: 'Кроссовки',
    price: sample(price.prices),
    colors:
      (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
      (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
      (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
      (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
      (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
      (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
      PRODUCT_COLOR,
    currency: price.currency
  };
});

export default products;
