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

import {src, dest} from 'gulp';
import gulpNewer from 'gulp-newer';
import vinylMap from 'vinyl-map';
import CleanCSS from 'clean-css';
import gulpSass from 'gulp-sass';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpRename from 'gulp-rename';
import {init, write} from 'gulp-sourcemaps';

import {dir, dateien} from '../gulp.config';

const minExtCss = 'min.css';

export const sass = () => {
    'use strict';
    const newerOptions = {dest: dir.layoutDist, ext: minExtCss};
    // gulp-clean-css ist deprecated
    // Alternativen: clean-css direkt verwenden (s.u.) oder gulp-nanocss (Basis: PostCSS)
    const minify = vinylMap((buffer) => {
        return new CleanCSS({
            // Eigene Optionen fuer clean-css
        }).minify(buffer.toString()).styles;
    });

    return src(dateien.sassLayout)
        .pipe(gulpNewer(newerOptions))
        .pipe(gulpSass())
        // Zulaessige Prefixe (-webkit, -moz, ...) siehe http://caniuse.com
        .pipe(gulpAutoprefixer({
            // siehe https://github.com/ai/browserslist
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpRename({extname: `.${minExtCss}`}))
        .pipe(init())
        .pipe(minify)
        .pipe(write('.'))
        .pipe(dest(dir.layoutDist));
};