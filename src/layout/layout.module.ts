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

import ROOT_ROUTES from '../app/root.routes';
import SharedModule from '../shared/shared.module';
import FooterComponent from './footer.component';
import Footer2Component from './footer2.component';

import HeaderComponent from './header.component';
import LoginComponent from './login.component';
import Login2Component from './login2.component';
import LogoComponent from './logo.component';
import LogoutComponent from './logout.component';
import Logout2Component from './logout2.component';

import MainComponent from './main.component';
import NavComponent from './nav.component';

const komponentenExport: Array<Type<any>> = [
    FooterComponent, Footer2Component, HeaderComponent, LoginComponent,
    Login2Component, LogoComponent, LogoutComponent, Logout2Component,
    MainComponent, NavComponent
];
const komponentenIntern: Array<Type<any>> = [];

@NgModule({
    imports: [SharedModule, ROOT_ROUTES],
    declarations: [...komponentenExport, ...komponentenIntern],
    exports: [...komponentenExport]
})
export default class LayoutModule {
}
