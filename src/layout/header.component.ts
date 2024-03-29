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

import {Component} from '@angular/core';

/**
 * Komponente f&uuml;r die Kopfleiste mit dem Tag &lt;my-header&gt;.
 */
@Component({
    selector: 'my-header',
    template: `
        <!-- Bootstrap 4:
                xs:      -  480px ("extra small")
                sm:      -  767px ("small")
                md:  768 -  991px ("medium")
                lg:  992 - 1199px ("large")
                xl: 1200 px       ("extra large")
        -->
        
        <header class="col-xs-12 jz-app-header">
            <div class="clearfix">
                <div class="mr-0 col-xs-12">
                    <my-login2></my-login2>
                    <my-logout2></my-logout2>
                </div>
            </div>

        </header>
    `,
    styleUrls: ['./layout/header.component.min.css']
    // styles: [
    //     `header {
    //         background-color: #BED6F8;
    //         background-position: left top;
    //         background-repeat: repeat-x;
    //         background-image: url(/img/gradientBlueSky.png);
    //      }`
    // ]
})
export default class HeaderComponent {
    constructor() {
        console.log('HeaderComponent.constructor()');
    }
}
