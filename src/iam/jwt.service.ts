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

import {BASE_URI, isEmpty, isPresent, log, TIMEZONE_OFFSET_MS} from '../shared';
import CookieService from './cookie.service';

@Injectable()
export default class JwtService {
    constructor(@Inject(CookieService) private readonly cookieService:
                    CookieService) {
        console.log('JwtService.constructor()');
    }

    @log
    async login(username: string, password: string):
        Promise<Array<string>|undefined> {
        console.log(`iam.login(): username=${username}, password=${password}`);
        const loginUri: string = `${BASE_URI}login`;
        console.log(`Login URI = ${loginUri}`);

        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        const body: string = `username=${username}&password=${password}`;
        const request: Request = new Request(
            loginUri, {method: 'POST', headers: headers, body: body});

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
        const token: string = json.token;
        const authorization: string = `Bearer ${token}`;
        console.log(`authorization=${authorization}`);

        // Array von Strings als 1 String
        const roles: Array<string> = json.roles;
        const rolesStr: string = json.roles.join();
        console.log(`rolesStr=${rolesStr}`);

        const decodedToken: any = this.decodeToken(token);
        console.log('decodedToken', decodedToken);
        if (!isPresent(decodedToken.exp)) {
            return;
        }

        // Expiration beim Token: Sekunden seit 1.1.1970 UTC
        // Cookie: Millisekunden in eigener Zeitzone
        const expiration: number = decodedToken.exp * 1000 + TIMEZONE_OFFSET_MS;
        console.log(`fetch.then(): exp=${expiration}`);
        this.cookieService.saveAuthorization(
            authorization, rolesStr, expiration);

        return Promise.resolve(roles);
    }

    toString(): string {
        return 'JwtService';
    }

    // https://github.com/auth0/angular2-jwt/blob/master/angular2-jwt.ts#L147
    private decodeToken(token: string): any {
        // Destructuring
        const [, payload, signature]: Array<string> = token.split('.');
        if (signature === undefined) {
            console.error('JWT enthaelt keine Signature');
            return undefined;
        }

        let base64Token: string = payload.replace(/-/g, '+').replace(/_/g, '/');
        switch (base64Token.length % 4) {
            case 0:
                break;
            case 2:
                base64Token += '==';
                break;
            case 3:
                base64Token += '=';
                break;
            default:
                console.error('Laenge des JWT in Base64 ist falsch.');
                return undefined;
        }

        // http://xkr.us/articles/javascript/encode-compare
        // http://stackoverflow.com/questions/75980/when-are-you-supposed-to-use-escape-instead-of-encodeuri-encodeuricomponent#23842171
        const decodedStr: string =
            decodeURIComponent(encodeURIComponent(window.atob(base64Token)));
        if (isEmpty(decodedStr)) {
            console.error('JWT kann nicht decodiert werden.');
            return undefined;
        }
        return JSON.parse(decodedStr);
    }
}
