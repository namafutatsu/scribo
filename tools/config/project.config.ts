import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    // this.APP_TITLE = 'Put name of your app here';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      { src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      { src: 'froala-editor/js/froala_editor.pkgd.min.js', inject: 'libs' },
      { src: 'font-awesome/css/font-awesome.min.css', inject: true },
      { src: 'froala-editor/css/froala_editor.pkgd.min.css', inject: true },
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      { src: `${this.CSS_SRC}/scribo-theme.css`, inject: true, vendor: false },
      { src: `${this.CSS_SRC}/tree.css`, inject: true, vendor: false }
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    // Add packages (e.g. ng2-translate)
    let additionalPackages: ExtendPackages[] = [
      // required for dev build
      {
        name:'angular2-froala-wysiwyg',
        path:'node_modules/angular2-froala-wysiwyg/bundles/angular2-froala-wysiwyg.umd.min.js'
      },

      // required for prod build
      {
        name:'angular2-froala-wysiwyg/*',
        path:'node_modules/angular2-froala-wysiwyg/bundles/angular2-froala-wysiwyg.umd.min.js'
      },
      {
        name:'angular-tree-component',
        path:'node_modules/angular-tree-component/dist/angular-tree-component.umd.js'
      },
      {
        name:'ng2-tree',
        path:'node_modules/ng2-tree/index.js'
      }
      // {
      //   name:'angular-in-memory-web-api',
      //   path:'node_modules/angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
      // }
    ];

    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
