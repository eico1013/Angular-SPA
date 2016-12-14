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

import {EventEmitter, Inject, Injectable} from '@angular/core';

import {isPresent, log} from '../shared';
import CookieService from './cookie.service';
import JwtService from './jwt.service';

export const ROLLE_ADMIN: string = 'admin';

@Injectable()
export class IamService {
    private isLoggedInEmitter: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    private rollenEmitter: EventEmitter<Array<string>> =
        new EventEmitter<Array<string>>();

    constructor(
        @Inject(JwtService) private readonly jwtService: JwtService,
        @Inject(CookieService) private readonly cookieService: CookieService) {
        console.log('IamService.constructor()');
    }

    /**
     * @param username {string} als String
     * @param password {string} als String
     * @return void
     */
    @log
    async login(username: string, password: string): Promise<void> {
        let rollen: Array<string>|undefined;
        try {
            // this.basicAuthService.login(username, password);
            rollen = await this.jwtService.login(username, password);
        } catch (err) {
            this.isLoggedInEmitter.emit(false);
            this.rollenEmitter.emit([]);
            return;
        }

        this.isLoggedInEmitter.emit(true);
        this.rollenEmitter.emit(rollen);
    }

    /**
     * @return void
     */
    @log
    logout(): void {
        this.cookieService.deleteAuthorization();
        this.isLoggedInEmitter.emit(false);
        this.rollenEmitter.emit([]);
    }

    @log
    observeIsLoggedIn(next: (event: boolean) => void): any {
        // Observable.subscribe() aus RxJS liefert ein Subscription Objekt,
        // mit dem man den Request abbrechen ("cancel") kann
        // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md
        // http://stackoverflow.com/questions/34533197/what-is-the-difference-between-rx-observable-subscribe-and-foreach
        // https://xgrommx.github.io/rx-book/content/observable/observable_instance_methods/subscribe.html
        return this.isLoggedInEmitter.subscribe(next);
    }

    @log
    observeRollen(next: (event: Array<string>) => void): any {
        return this.rollenEmitter.subscribe(next);
    }

    /**
     * @return String fuer JWT oder Basic-Authentifizierung
     */
    getAuthorization(): string|undefined {
        return this.cookieService.getAuthorization();
    }

    /**
     * @return true, falls ein User eingeloggt ist; sonst false.
     */
    isLoggedIn(): boolean {
        return this.cookieService.getAuthorization() !== undefined;
    }

    /**
     * @return true, falls ein User in der Rolle "admin" eingeloggt ist;
     *         sonst false.
     */
    isAdmin(): boolean {
        // z.B. 'admin,mitarbeiter'
        const rolesStr: string|undefined = this.cookieService.getRoles();
        if (rolesStr === undefined) {
            return false;
        }

        // z.B. ['admin', 'mitarbeiter']
        const rolesArray: Array<string> = rolesStr.split(',');
        return isPresent(rolesArray)
            && rolesArray.find(r => r === ROLLE_ADMIN) !== undefined;
    }

    toString(): string {
        return 'IamService';
    }
}
