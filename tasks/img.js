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

import {src, dest} from 'gulp';
import minimist from 'minimist';
import gulpNewer from 'gulp-newer';
import gulpif from 'gulp-if';
import gulpImagemin from 'gulp-imagemin';
// import through from 'through2';

import {dateien, dir} from '../gulp.config';

export const img = (done) => {
    'use strict';
    const argv = minimist(process.argv.slice(2));
    // const noop = through.obj;
    src(dateien.img)
        .pipe(gulpNewer(dir.imgDist))
        .pipe(gulpif(argv.imagemin, gulpImagemin()))
        //.pipe(argv.imagemin ? gulpImagemin() : noop())
        .pipe(dest(dir.imgDist));
    done();
};
