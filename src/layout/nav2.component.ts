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

import {IamService, ROLLE_ADMIN} from '../iam/iam.service';
import {log} from '../shared';

/**
 * Komponente f&uuml;r die Navigationsleiste mit dem Tag &lt;my-nav&gt;.
 */
@Component({
    selector: 'my-nav2',
    // Internationalisierung durch z.B. https://github.com/ocombe/ng2-translate
    template: `
        <nav class="col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3 jz-app-nav">
            <!-- http://v4-alpha.getbootstrap.com/components/list-group/#linked-items -->
            <!-- Alternative CSS-Klassen fuer list-group: navs, nav-item, nav-link -->
            <!-- http://v4-alpha.getbootstrap.com/components/navs -->
            <div class="list-group">
                <!-- Pfade aus root.routes.ts -->
                <div class="list-group-item">
                    <a [routerLink]="'/'">
                        <i class="fa fa-home"></i>
                        <!-- margin left -->
                        <span class="ml-1">Startseite</span>
                    </a>
                </div>

                <div class="list-group-item">
                    <a [routerLink]="'/sucheKunden'">
                        <i class="fa fa-search"></i>
                        <span class="ml-1">Suche</span>
                    </a>
                </div>

                <div class="list-group-item" *ngIf="isAdmin">
                    <a [routerLink]="'/createBuch'">
                        <i class="fa fa-book"></i>
                        <span class="ml-1">Neuer Kunde</span>
                    </a>
                </div>

              <!--  <div class="list-group-item" *ngIf="isAdmin">
                    <a [routerLink]="'/balkendiagramm'">
                        <i class="fa fa-bar-chart"></i>
                        <span class="ml-1">Balkendiagramm</span>
                    </a>
                </div>
                <div class="list-group-item" *ngIf="isAdmin">
                    <a [routerLink]="'/liniendiagramm'">
                        <i class="fa fa-line-chart"></i>
                        <span class="ml-1">Liniendiagramm</span>
                    </a>
                </div>
                <div class="list-group-item" *ngIf="isAdmin">
                    <a [routerLink]="'/tortendiagramm'">
                        <i class="fa fa-pie-chart"></i>
                        <span class="ml-1">Tortendiagramm</span>
                    </a>
                </div> -->
            </div>
        </nav>
    `,
    styleUrls: ['./layout/nav.component.min.css']
    // styles: ['.jz-app-nav{background-color:#BED6F8}']
})
export default class Nav2Component implements OnInit {
    isAdmin: boolean;

    constructor(private readonly iamService: IamService) {
        console.log('Nav2Component.constructor()');
    }

    @log
    ngOnInit(): void {
        this.isAdmin = this.iamService.isAdmin();
        this.observeIsAdmin();
    }

    toString(): string {
        return 'Nav2Component';
    }

    /**
     * Methode, um den injizierten <code>BuecherService</code> zu beobachten,
     * ob es gefundene bzw. darzustellende B&uuml;cher gibt, die in der
     * Kindkomponente f&uuml;r das Tag <code>gefundene-buecher</code>
     * dargestellt werden. Diese private Methode wird in der Methode
     * <code>ngOnInit</code> aufgerufen.
     */
    private observeIsAdmin(): void {
        const next: (event: Array<string>) => void = (event) => {
            this.isAdmin = event.find(r => r === ROLLE_ADMIN) !== undefined;
            console.log('Nav2Component.isAdmin:', this.isAdmin);
        };

        // Funktion als Funktionsargument, d.h. Code als Daten uebergeben
        this.iamService.observeRollen(next);
    }
}
