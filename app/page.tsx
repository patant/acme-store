// Thin on purpose: the storefront is the package, this repo is the content.
//
// @brink/storefront is not published yet, so this file records the shape rather than
// running. When the package lands, the home page stays about this size.
import { Storefront } from '@brink/storefront';
import config from '../brink.config';

export default function Home() {
  return <Storefront config={config} route="/" />;
}
