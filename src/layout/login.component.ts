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

import {IamService} from '../iam/iam.service';
import {log} from '../shared';

/**
 * Komponente f&uuml;r das Login mit dem Tag &lt;my-login&gt;.
 */
@Component({
    selector: 'my-login',
    template: `
        <div class="card-block" *ngIf="!isLoggedIn">
            <form (submit)="onLogin()" role="form">
                <div class="form-group row">
                    <label for="usernameInput"
                           class="col-sm-8 form-control-label text-xs-right">
                        <small>Benutzername</small>
                    </label>
                    <div class="col-sm-3">
                        <input id="usernameInput"
                            type="search" class="form-control form-control-sm"
                            tabindex="1" autocomplete="off" required
                            [(ngModel)]="username" name="username">
                    </div>
                    <div class="col-sm-1">
                        <button class="btn btn-primary btn-sm" tabindex="3">
                            Login
                        </button>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="passwordInput"
                           class="col-sm-8 form-control-label text-xs-right">
                        <small>Passwort</small>
                    </label>
                    <div class="col-sm-3">
                        <input id="passwordInput"
                            type="password" class="form-control form-control-sm"
                            tabindex="2" autocomplete="off" required
                            [(ngModel)]="password" name="password">
                    </div>
                </div>
            </form>
        </div>
    `
})
export default class LoginComponent implements OnInit {
    username: string;
    password: string;
    isLoggedIn: boolean;

    constructor(private readonly iamService: IamService) {
        console.log('LoginComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        // Initialisierung, falls zwischenzeitlich der Browser geschlossen wurde
        this.isLoggedIn = this.iamService.isLoggedIn();
        this.observeLogin();
    }

    @log
    onLogin(): void {
        this.iamService.login(this.username, this.password);
    }

    toString(): string {
        return 'LoginComponent';
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
            if (!this.isLoggedIn && !event) {
                // Noch nicht eingeloggt und ein Login-Event kommt, d.h.
                // es gab einen Login-Versuch, der aber fehlerhaft (= false) war
                // TODO Anzeige des fehlgeschlagenen Logins
                console.warn('LoginComponent: Falsche Login-Daten');
            }
            this.isLoggedIn = event;
            console.log('LoginComponent.isLoggedIn:', this.isLoggedIn);
        };

        // Funktion als Funktionsargument, d.h. Code als Daten uebergeben
        this.iamService.observeIsLoggedIn(next);
    }
}
