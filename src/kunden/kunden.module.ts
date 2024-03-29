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

import {NgModule, Type} from '@angular/core';
import {Title} from '@angular/platform-browser';

import ROOT_ROUTES from '../app/root.routes';
import SharedModule from '../shared/shared.module';
import CreateKundenComponent from './create-kunden/create-kunden.component';
import CreateKundenGuard from './create-kunden/create-kunden.guard';

// import CreateBuchComponent from './create-buch/create-buch.component';
// import CreateBuchGuard from './create-buch/create-buch.guard';
// import DetailsBuchComponent from './details-buch/details-buch.component';
import DetailsKundeComponent from './details-kunden/details-kunde.component';
import DetailsInteressenComponent from
'./details-kunden/details-interessen.component';
// import DetailsStammdatenComponent from
// './details-buch/details-stammdaten.component';
import DetailsStammdatenComponent from
'./details-kunden/details-stammdaten.component';
// import BalkendiagrammComponent from './diagramme/balkendiagramm.component';
// import LiniendiagrammComponent from './diagramme/liniendiagramm.component';
// import TortendiagrammComponent from './diagramme/tortendiagramm.component';
import {KundenService} from './shared/kunden.service';
// import GefundeneBuecherComponent from
// './suche-buecher/gefundene-buecher.component';
import GefundeneKundenComponent from './suche-kunden/gefundene-kunden.component';
// import SucheBuecherComponent from './suche-buecher/suche-buecher.component';
import SucheKundenComponent from './suche-kunden/suche-kunden.component';
// import SuchergebnisComponent from './suche-buecher/suchergebnis.component';
import SuchergebnisComponent from './suche-kunden/suchergebnis.component';
// import SuchkriterienComponent from './suche-buecher/suchkriterien.component';
import SuchkriterienComponent from './suche-kunden/suchkriterien.component';
import UpdateKundeComponent from './update-kunden/update-kunden.component';
import UpdateSchlagwoerterComponent from
'./update-kunden/update-schlagwoerter.component';
import UpdateStammdatenComponent from
'./update-kunden/update-stammdaten.component';

const komponentenExport: Array<Type<any>> = [
    CreateKundenComponent, /*DetailsBuchComponent, BalkendiagrammComponent,
    LiniendiagrammComponent, TortendiagrammComponent, */
    SucheKundenComponent,  /*,
 UpdateBuchComponent*/
    /*CreateBuchComponent,*/ DetailsKundeComponent, /* BalkendiagrammComponent,
    LiniendiagrammComponent, TortendiagrammComponent, */
    SucheKundenComponent, UpdateKundeComponent
];

const komponentenIntern: Array<Type<any>> = [
    DetailsInteressenComponent, DetailsStammdatenComponent,
    GefundeneKundenComponent, SucheKundenComponent, SuchergebnisComponent,
    SuchkriterienComponent, UpdateSchlagwoerterComponent,
    UpdateStammdatenComponent
];

// Ein Modul enthaelt logisch zusammengehoerige Funktionalitaet
// Exportierte Komponenten koennen bei einem importierenden Modul in dessen
// Komponenten innerhalb deren Templates (= HTML-Fragmente) genutzt werden.
// BuecherModule ist ein "FeatureModule", das Features fuer Buecher bereitstellt
@NgModule({
    imports: [SharedModule, SharedModule.forRoot(), ROOT_ROUTES],
    declarations: [...komponentenExport, ...komponentenIntern],
    // BuecherService mit eigenem DI-Context innerhalb des Moduls, d.h.
    // es kann in anderen Moduln eine eigene Instanz von BuecherService geben.
    // Title als Singleton aus dem SharedModule
    providers: [KundenService, CreateKundenGuard, Title],
    exports: [...komponentenExport]
})
export default class KundenModule {
}
