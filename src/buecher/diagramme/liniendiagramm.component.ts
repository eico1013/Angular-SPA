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

import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {log} from '../../shared';
import {BuecherService} from '../shared/buecher.service';

/**
 * Komponente mit dem Tag &lt;my-liniendiagramm&gt; zur Visualisierung
 * von Bewertungen durch ein Liniendiagramm.
 */
@Component({
    selector: 'my-liniendiagramm',
    template: `
        <section id="diagramm">
            <canvas #chartCanvas width="300" height="150"></canvas>
        </section>
    `
})
export default class LiniendiagrammComponent implements AfterViewInit {
    @ViewChild('chartCanvas') chartCanvas: ElementRef;

    constructor(
        private readonly buecherService: BuecherService,
        private readonly titleService: Title) {
        console.log('LiniendiagrammComponent.constructor()');
    }

    /**
     * Das Liniendiagramm beim Tag <code><canvas></code> einf&uuml;gen.
     * Erst in ngAfterViewInit kann auf ein Kind-Element aus dem Templates
     * zugegriffen werden.
     */
    @log
    ngAfterViewInit(): void {
        const chartElement: HTMLCanvasElement = this.chartCanvas.nativeElement;
        this.buecherService.createLinearChart(chartElement);
        this.titleService.setTitle('Liniendiagramm');
    }

    toString(): string {
        return 'LiniendiagrammComponent';
    }
}
