// The only place store identity lives. Everything else in this repo is content.
import type { StoreConfig } from '@brink/storefront';

export default {
  storeId: 'acme',

  // A market is a country plus the currency it is priced in. Brink holds the prices;
  // this only says which markets the storefront renders.
  markets: [
    { code: 'SE', currency: 'SEK', locale: 'sv-SE', default: true },
    { code: 'NO', currency: 'NOK', locale: 'nb-NO' },
    { code: 'DK', currency: 'DKK', locale: 'da-DK' },
  ],

  // Derived and disposable: catalog-sync rebuilds these from this repo plus Brink.
  search: {
    productsIndex: 'products-acme',
    categoriesIndex: 'categories-acme',
  },
} satisfies StoreConfig;
