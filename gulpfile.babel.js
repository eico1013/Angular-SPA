/*
 * Copyright (C) 2015 - 2016 Juergen Zimmermann, Hochschule Karlsruhe
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

/* eslint-enable quotes: [2, "single"] */

/**
 * Tasks auflisten
 *    gulp --tasks
 *    gulp --tasks-simple
 */

import {all} from './tasks/all';
import {browsersync} from './tasks/browsersync';
import {bundle} from './tasks/bundle';
import {check} from './tasks/check';
import {clangformat} from './tasks/clangformat';
import {clean} from './tasks/clean';
import {css} from './tasks/css';
import {doc} from './tasks/doc';
import {fixme} from './tasks/fixme';
import {fonts} from './tasks/fonts';
import {html} from './tasks/html';
import {img} from './tasks/img';
import {initdist} from './tasks/initdist';
import {js} from './tasks/js';
import {nginx} from './tasks/nginx';
import {nginxinit} from './tasks/nginxinit';
import {nginxstop} from './tasks/nginxstop';
import {noproxy} from './tasks/noproxy';
import {proxy} from './tasks/proxy';
import {rebuild} from './tasks/rebuild';
import {sass} from './tasks/sass';
import {ts} from './tasks/ts';
import {tslint} from './tasks/tslint';

export {
    browsersync,
    bundle,
    check,
    clangformat,
    clean,
    css,
    doc,
    fixme,
    fonts,
    html,
    img,
    initdist,
    js,
    nginx,
    nginxinit,
    nginxstop,
    noproxy,
    proxy,
    rebuild,
    sass,
    ts,
    tslint
};

export default all;
