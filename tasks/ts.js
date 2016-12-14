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

import {src, dest, series} from 'gulp';
import {init, write} from 'gulp-sourcemaps';
import gulpTypescript from 'gulp-typescript';
import typescript from 'typescript';

import * as tsconfigJson from '../tsconfig.json';
import {check} from './check';
import {dateien, dir} from '../gulp.config';

const tsc = () => {
    'use strict';
    const options = tsconfigJson.compilerOptions;
    options.typescript = typescript;
    return src(dateien.ts)
        .pipe(init())
        .pipe(gulpTypescript(options))
        .pipe(write(`.`))
        .pipe(dest(dir.tmp));
};
export const ts = series(check, tsc);
