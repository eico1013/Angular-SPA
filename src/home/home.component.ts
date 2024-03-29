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
import {Title} from '@angular/platform-browser';

import {log} from '../shared';

@Component({
    selector: 'my-home',
    template: `
    <div class="card">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="progress">
                        <div class="progress-bar progress-success">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>        
    `
})
export default class HomeComponent implements OnInit {
    constructor(private readonly titleService: Title) {
        console.log('HomeComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        this.titleService.setTitle('Beispiel');
    }

    toString(): String {
        return 'HomeComponent';
    }
}
