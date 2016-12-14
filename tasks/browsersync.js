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

/* global process */

import minimist from 'minimist';
import log from 'connect-logger';
import connectHistoryApiFallback from 'connect-history-api-fallback';
import browserSyncPkg from 'browser-sync';

import {dir, portWebServer, host} from '../gulp.config';

export const browsersync = () => {
    'use strict';
    const argv = minimist(process.argv.slice(2));
    // Nicht bs-config.js wg. Middleware log() und connectHistoryApiFallback()
    const options = {
        server: {baseDir: dir.baseWeb},
        https: {
            key: `${dir.webserverConfig}/tls/key.pem`,
            cert: `${dir.webserverConfig}/tls/cert.cer`
        },
        port: portWebServer,
        host: host,
        middleware: [
            log({format: '%date %status %method %url'}),
            connectHistoryApiFallback({
                index: '/index.html',
                htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
            })
        ],
        logConnections: false,
        online: argv.online !== undefined,
        ui: false,
        browser: 'chrome',
        reloadOnRestart: true,
        notify: false
    };
    browserSyncPkg(options);
};
