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

import {BASE_URI, log} from '../shared';
import CookieService from './cookie.service';

declare type Rolle = 'ROLE_ADMIN' | 'ROLE_KUNDE' | 'ROLE_MITARBEITER';

export interface Identity {
    username: string;
    rollen: Array<Rolle>;
    password?: string;
}

@Injectable()
export default class BasicAuthService {
    constructor(@Inject(CookieService) private readonly cookieService:
                    CookieService) {
        console.log('BasicAuthService.constructor()');
    }

    /**
     * @param username {string} als String
     * @param password {string} als String
     * @return void
     */
    @log
    async login(username: string, password: string): Promise<void> {
        const loginUri: string = `${BASE_URI}login`;
        console.log(`Login URI = ${loginUri}`);

        const base64: string = window.btoa(`${username}:${password}`);
        const basicAuth: string = `Basic ${base64}`;
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const headers: Headers = new Headers();
        headers.append('Authorization', basicAuth);

        const request: Request =
            new Request(loginUri, {method: 'POST', headers: headers});

        // ES 2015: Promise.then(...) statt async/await in ES 2017
        //   fetch(request)
        //   .then((response: Response): Promise<any> => {...})
        //   .then((json: any) => {...})
        //   .catch((err: any) => {...});

        let response: Response;
        try {
            response = await fetch(request);
        } catch (err) {
            console.error('iam.login: Kommunikationsfehler mit dem Appserver');
            return Promise.reject(
                new Error('Kommunikationsfehler mit dem Appserver'));
        }

        const status: number = response.status;
        console.log(`status=${status}`);
        if (status !== 200) {
            return Promise.reject(new Error(response.statusText));
        }

        const json: any = await response.json();
        console.log('json', json);
        // Array von Strings als 1 String
        const roles: string = json.roles.join();
        console.log(`roles=${roles}`);

        this.cookieService.saveAuthorization(
            // Base64-String fuer 1 Tag speichern
            basicAuth, roles, 24 * 60 * 60 * 1000);
    }

    toString(): string {
        return 'BasicAuthService';
    }
}
