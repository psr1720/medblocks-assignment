// import { PGlite } from '@electric-sql/pglite';
import { PGlite} from "https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js"
import { worker } from '@electric-sql/pglite/worker';

worker({
  async init() {
    return new PGlite('idb://medblocks-db');
  },
});