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
      { src: 'jquery/dist/jquery.min.js', inject: 'libs' },
      { src: 'froala-editor/js/froala_editor.pkgd.min.js', inject: 'libs' },
      { src: 'font-awesome/css/font-awesome.min.css', inject: true },
      { src: 'froala-editor/css/froala_editor.pkgd.min.css', inject: true },
      { src: `bootstrap/dist/css/bootstrap.min.css`, inject: true }
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
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

    // Add packages(e.g.ng2 - translate)
    const additionalPackages: ExtendPackages[] = [
      // required for dev build
      {
        name: 'angular-froala-wysiwyg',
        path: 'node_modules/angular-froala-wysiwyg/bundles/angular-froala-wysiwyg.umd.min.js'
      },

      // required for prod build
      {
        name: 'angular-froala-wysiwyg/*',
        path: 'node_modules/angular-froala-wysiwyg/bundles/angular-froala-wysiwyg.umd.min.js'
      },
      {
        name: 'angular-tree-component',
        path: 'node_modules/angular-tree-component/dist/angular-tree-component.umd.js'
      },
      {
        name: 'ng2-tree',
        path: 'node_modules/ng2-tree',
        packageMeta: {
          defaultExtension: 'js',
          main: 'index'
        }
      },
      {
        name: 'angular2-uuid',
        path: 'node_modules/angular2-uuid/index.js'
      },
      {
        name: 'bcryptjs',
        path: 'node_modules/bcryptjs/dist/bcrypt.js'
      },
      {
        name: '@auth0/angular-jwt',
        path: 'node_modules/@auth0/angular-jwt/bundles/core.umd.js',
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'angular2-hotkeys',
        path: 'node_modules/angular2-hotkeys/src',
        packageMeta: {
          defaultExtension: 'js',
          main: '../index'
        }
      },
      {
        name: 'hotkeys-directive',
        path: 'node_modules/angular2-hotkeys/src/hotkeys.directive.js',
      },
      {
        name: 'mousetrap',
        path: 'node_modules/mousetrap/mousetrap.js'
      },
      {
        name: 'file-saver',
        path: 'node_modules/file-saver/FileSaver.min.js'
      },
      {
        name: 'ngx-smart-modal',
        path: 'node_modules/ngx-smart-modal/bundles/ngx-smart-modal.umd.js',
      },
      {
        name: 'rxjs',
        path: 'node_modules/rxjs',
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: 'rxjs/internal-compatibility',
        path: 'node_modules/rxjs/internal-compatibility/index.js'
      },
      {
        name: 'rxjs/operators',
        path: 'node_modules/rxjs/Operator.js'
      },
      {
        name: 'rxjs/ajax',
        path: 'node_modules/rxjs/ajax/index.js'
      },
      {
        name: 'rxjs/testing',
        path: 'node_modules/rxjs/testing/index.js'
      },
      {
        name: 'rxjs/webSocket',
        path: 'node_modules/rxjs/webSocket/index.js'
      },
      {
        name: 'rxjs/bindCallback',
        path: 'node_modules/rxjs/add/observable/bindCallback.js'
      },
      {
        name: 'rxjs-compat',
        path: 'node_modules/rxjs-compat',
        packageMeta: {
          defaultExtension: 'js',
          main: 'Rx'
        }
      },
      {
        name: 'lodash',
        path: 'node_modules/lodash',
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: '@angular/http',
        path: 'node_modules/@angular/http/bundles/http.umd.js',
      },
      // {
      //   name: 'mongoose-materialized',
      //   path: 'node_modules/mongoose-materialized',
      //   packageMeta: {
      //     defaultExtension: 'js'
      //   }
      // },
      // {
      //   name: 'mongodb-core',
      //   path: 'node_modules/mongodb-core',
      //   packageMeta: {
      //     defaultExtension: 'js'
      //   }
      // },
      {
        name: 'require_optional',
        path: 'node_modules/require_optional',
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      // {
      //   name: ' require_optional',
      //   path: 'node_modules/require_optional',
      //   packageMeta: {
      //     defaultExtension: 'js'
      //     // main: 'Rx'
      //   }
      // },
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
