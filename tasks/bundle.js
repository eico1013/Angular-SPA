/*
 * Copyright (C) 2016 Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global __dirname */
/* global process */

import {parallel, series} from 'gulp';
import {statSync} from 'fs';
import {join} from 'path';
import SystemBuilder from 'systemjs-builder';
import gulplog from 'gulplog';
import minimist from 'minimist';

import {ts} from './ts';
import {html} from './html';
import {img} from './img';
import {sass} from './sass';
import {dateien, minifiedBundle} from '../gulp.config';

const bundleFn = (done) => {
    'use strict';

    try {
        statSync(join(__dirname, '..', 'tmp', 'app', 'main.js'));
    }
    catch (e) {
        gulplog.error(`ERROR: main.js existiert nicht im Unterverzeichnis tmp`);
        done();
        return;
    }

    const argv = minimist(process.argv.slice(2));
    const prod = argv.minify === undefined && argv.prod === undefined ? minifiedBundle : true;
    // SystemJS Builder basiert auf Rollup
    // https://github.com/robwormald/new-world-test/blob/master/es6-or-ts-bundle/rollup.config.js
    const builder = new SystemBuilder();
    // https://github.com/robwormald/new-world-test/tree/system/system-js
    // https://github.com/systemjs/builder/blob/master/README.md#example---third-party-dependency-bundles
    builder.loadConfig('./system-builder.config.js')
           .then(() => {
                // https://github.com/systemjs/builder/blob/master/README.md#self-executing-sfx-bundles
                const buildOptions = {
                    minify: prod,
                    mangle: prod,
                    rollup: prod,
                    sourceMaps: prod
                };
	            return builder.buildStatic('app', dateien.bundle, buildOptions);
           })
           .then(() => {
               if (prod) {
                   gulplog.info(`Die Datei ${dateien.bundle} wurde minifiziert erstellt.`);
               } else {
                   gulplog.info(`Die Datei ${dateien.bundle} wurde erstellt.`);
               }
               done();
           });
    done();
};
export const bundle = parallel(series(ts, bundleFn), html, sass, img);
