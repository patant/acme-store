// The only place store identity lives. Everything else in this repo is content.
//
// The StoreConfig type will come from @brink/storefront once it is published. Until
// then it is declared here so the template type-checks and runs on its own.
export type Market = {
  code: string;
  currency: string;
  locale: string;
  default?: boolean;
};

export type StoreConfig = {
  storeId: string;
  name: string;
  markets: Market[];
  search: { productsIndex: string; categoriesIndex: string };
};

export default {
  storeId: 'acme',
  name: 'Acme',

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
