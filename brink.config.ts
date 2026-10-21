// The only place store identity lives. Everything else in this repo is content.
//
// The StoreConfig type will come from @brink/storefront once it is published. Until
// then it is declared here so the template type-checks and runs on its own.
export type Market = {
  code: string;
  currency: string;
  locale: string;
  /** Bare language code for the shopper session. Klarna joins it to the country, so
   *  'sv-SE' here would become sv-SE-SE there. */
  language: string;
  default?: boolean;
};

export type StoreConfig = {
  storeId: string;
  storeGroupId: string;
  name: string;
  shopperUrl: string;
  markets: Market[];
  search: { productsIndex: string; categoriesIndex: string };
};

export default {
  storeId: 'acme',
  storeGroupId: 'acme',
  name: 'Acme',

  // The browser-facing Shopper API, so no API key. Defaults to the dev account.
  shopperUrl: process.env.BRINK_SHOPPER_URL ?? 'https://shopper.eu-west-1.patant.dev.brinkcommerce.io',

  // A market is a country plus the currency it is priced in. Brink holds the prices;
  // this only says which markets the storefront renders.
  markets: [
    { code: 'SE', currency: 'SEK', locale: 'sv-SE', language: 'sv', default: true },
    { code: 'NO', currency: 'NOK', locale: 'nb-NO', language: 'nb' },
    { code: 'DK', currency: 'DKK', locale: 'da-DK', language: 'da' },
  ],

  // Derived and disposable: catalog-sync rebuilds these from this repo plus Brink.
  search: {
    productsIndex: 'products-acme',
    categoriesIndex: 'categories-acme',
  },
} satisfies StoreConfig;
