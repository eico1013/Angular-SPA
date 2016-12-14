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

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {HOME_PATH} from '../app/root.routes';
import {IamService} from '../iam/iam.service';
import {log} from '../shared';

/**
 * Komponente f&uuml;r das Logout mit dem Tag &lt;my-logout&gt;.
 */
@Component({
    selector: 'my-logout',
    template: `
        <div *ngIf="isLoggedIn">
            <div class="col-xs-10"></div>
            <div class="col-xs-2">
                <i class="fa fa-2x fa-sign-out"></i>
                <button class="btn btn-primary ml-1" type="button"
                        (click)="onLogout()">
                    Logout
                </button>
            </div>
        </div>
    `
})
export default class LogoutComponent implements OnInit {
    isLoggedIn: boolean;

    constructor(
        private readonly router: Router,
        private readonly iamService: IamService) {
        console.log('LogoutComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        // Initialisierung, falls zwischenzeitlich der Browser geschlossen wurde
        this.isLoggedIn = this.iamService.isLoggedIn();
        this.observeLogin();
    }

    /**
     * Ausloggen und dabei Benutzername und Passwort zur&uuml;cksetzen.
     */
    @log
    onLogout(): void {
        this.iamService.logout();
        this.router.navigate([HOME_PATH]);
    }

    toString(): string {
        return 'LogoutComponent';
    }

    /**
     * Methode, um den injizierten <code>BuecherService</code> zu beobachten,
     * ob es gefundene bzw. darzustellende B&uuml;cher gibt, die in der
     * Kindkomponente f&uuml;r das Tag <code>gefundene-buecher</code>
     * dargestellt werden. Diese private Methode wird in der Methode
     * <code>ngOnInit</code> aufgerufen.
     */
    private observeLogin(): void {
        const next: (event: boolean) => void = (event) => {
            this.isLoggedIn = event;
            console.log('LogoutComponent.isLoggedIn:', this.isLoggedIn);
        };

        // Funktion als Funktionsargument, d.h. Code als Daten uebergeben
        this.iamService.observeIsLoggedIn(next);
    }
}
