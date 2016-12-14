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

import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {HOME_PATH} from '../app/root.routes';
import {log} from '../shared';
import {IamService} from './iam.service';

@Injectable()
export default class AdminGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        @Inject(IamService) private iamService: IamService) {
        console.log('AdminGuard.constructor()');
    }

    @log
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean>|boolean {
        // Kein Observer moeglich, da CanActivate im Router benoetigt wird
        if (this.iamService.isAdmin()) {
            return true;
        }

        console.warn('Nicht in der Rolle "admin" eingeloggt');
        this.router.navigate([HOME_PATH]);
        return false;
    }

    toString(): string {
        return 'AdminGuard';
    }
}
