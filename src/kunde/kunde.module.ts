// /*
//  * Copyright (C) 2016 Juergen Zimmermann, Hochschule Karlsruhe
//  *
//  * This program is free software: you can redistribute it and/or modify
//  * it under the terms of the GNU General Public License as published by
//  * the Free Software Foundation, either version 3 of the License, or
//  * (at your option) any later version.
//  *
//  * This program is distributed in the hope that it will be useful,
//  * but WITHOUT ANY WARRANTY; without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  * GNU General Public License for more details.
//  *
//  * You should have received a copy of the GNU General Public License
//  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
//  */

// import {NgModule, Type} from '@angular/core';
// import {Title} from '@angular/platform-browser';

// import ROOT_ROUTES from '../app/root.routes';
// import SharedModule from '../shared/shared.module';

// import CreateBuchComponent from './create-buch/create-buch.component';
// import CreateBuchGuard from './create-buch/create-buch.guard';
// import DetailsBuchComponent from './details-buch/details-buch.component';
// import DetailsSchlagwoerterComponent from './details-buch/details-schlagwoerter.component';
// import DetailsStammdatenComponent from './details-buch/details-stammdaten.component';
// import BalkendiagrammComponent from './diagramme/balkendiagramm.component';
// import LiniendiagrammComponent from './diagramme/liniendiagramm.component';
// import TortendiagrammComponent from './diagramme/tortendiagramm.component';
// import {BuecherService} from './shared/buecher.service';
// import GefundeneBuecherComponent from './suche-buecher/gefundene-buecher.component';
// import SucheBuecherComponent from './suche-buecher/suche-buecher.component';
// import SuchergebnisComponent from './suche-buecher/suchergebnis.component';
// import SuchkriterienComponent from './suche-buecher/suchkriterien.component';
// import UpdateBuchComponent from './update-buch/update-buch.component';
// import UpdateSchlagwoerterComponent from './update-buch/update-schlagwoerter.component';
// import UpdateStammdatenComponent from './update-buch/update-stammdaten.component';

// const komponentenExport: Array<Type<any>> = [
//     CreateBuchComponent, DetailsBuchComponent, BalkendiagrammComponent,
//     LiniendiagrammComponent, TortendiagrammComponent, SucheBuecherComponent,
//     UpdateBuchComponent
// ];

// const komponentenIntern: Array<Type<any>> = [
//     DetailsSchlagwoerterComponent, DetailsStammdatenComponent,
//     GefundeneBuecherComponent, SucheBuecherComponent, SuchergebnisComponent,
//     SuchkriterienComponent, UpdateSchlagwoerterComponent,
//     UpdateStammdatenComponent
// ];

// // Ein Modul enthaelt logisch zusammengehoerige Funktionalitaet
// // Exportierte Komponenten koennen bei einem importierenden Modul in dessen
// // Komponenten innerhalb deren Templates (= HTML-Fragmente) genutzt werden.
// // BuecherModule ist ein "FeatureModule", das Features fuer Buecher bereitstellt
// @NgModule({
//     imports: [SharedModule, SharedModule.forRoot(), ROOT_ROUTES],
//     declarations: [...komponentenExport, ...komponentenIntern],
//     // BuecherService mit eigenem DI-Context innerhalb des Moduls, d.h.
//     // es kann in anderen Moduln eine eigene Instanz von BuecherService geben.
//     // Title als Singleton aus dem SharedModule
//     providers: [BuecherService, CreateBuchGuard, Title],
//     exports: [...komponentenExport]
// })
// export default class BuecherModule {
// }

