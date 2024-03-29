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

import {EventEmitter, Inject, Injectable} from '@angular/core';
// Bereitgestellt durch das HttpModule (s. Re-Export im SharedModule)
// HttpModule enthaelt nur Services, keine Komponenten
import {Headers, Http, RequestOptionsArgs, Response, URLSearchParams} from '@angular/http';

import {ChartConfig, ChartDataSet} from 'chart.js';
import * as _ from 'lodash';
// Moment exportiert den Namespace moment und die gleichnamige Function:
// http://stackoverflow.com/questions/35254524/using-moment-js-in-angular-2-typescript-application#answer-35255412
import * as moment_ from 'moment';
import {Moment} from 'moment';

import {IamService} from '../../iam/iam.service';
import {BASE_URI, isBlank, isEmpty, isPresent, log, PATH_BUECHER} from '../../shared';
// Aus dem SharedModule als Singleton exportiert
import DiagrammService from '../../shared/diagramm.service';
import {Buch, BuchForm, BuchServer} from './index';

const moment: (date: Date) => Moment = (<any>moment_)['default'];

// Methoden der Klasse Http
//  * get(url, options) – HTTP GET request
//  * post(url, body, options) – HTTP POST request
//  * put(url, body, options) – HTTP PUT request
//  * patch(url, body, options) – HTTP PATCH request
//  * delete(url, options) – HTTP DELETE request

// Eine Service-Klasse ist eine "normale" Klasse gemaess ES 2015, die mittels
// DI in eine Komponente injiziert werden kann, falls sie innerhalb von
// provider: [...] bei einem Modul oder einer Komponente bereitgestellt wird.
// Eine Komponente realisiert gemaess MVC-Pattern den Controller und die View.
// Die Anwendungslogik wird vom Controller an Service-Klassen delegiert.

/**
 * Die Service-Klasse zu B&uuml;cher.
 */
@Injectable()
export class BuecherService {
    private baseUriBuecher: string;
    private buecherEmitter: EventEmitter<Array<Buch>> =
        new EventEmitter<Array<Buch>>();
    private buchEmitter: EventEmitter<Buch> = new EventEmitter<Buch>();
    private errorEmitter: EventEmitter<string|number> =
        new EventEmitter<string|number>();
    private _buch: Buch;

    /**
     * @param diagrammService injizierter DiagrammService
     * @param http injizierter Service Http (von AngularJS)
     * @return void
     */
    constructor(
        @Inject(DiagrammService) private readonly diagrammService:
            DiagrammService,
        @Inject(Http) private readonly http: Http,
        @Inject(IamService) private readonly iamService: IamService) {
        this.baseUriBuecher = `${BASE_URI}${PATH_BUECHER}`;
        console.log(
            'BuecherService.constructor(): baseUriBuecher='
            + this.baseUriBuecher);
    }

    /**
     * Ein Buch-Objekt puffern.
     * @param buch Das Buch-Objekt, das gepuffert wird.
     * @return void
     */
    set buch(buch: Buch) {
        console.log('BuecherService.set buch()', buch);
        this._buch = buch;
    }

    @log
    observeBuecher(next: (buecher: Array<Buch>) => void): any {
        // Observable.subscribe() aus RxJS liefert ein Subscription Objekt,
        // mit dem man den Request abbrechen ("cancel") kann
        // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md
        // http://stackoverflow.com/questions/34533197/what-is-the-difference-between-rx-observable-subscribe-and-foreach
        // https://xgrommx.github.io/rx-book/content/observable/observable_instance_methods/subscribe.html
        return this.buecherEmitter.subscribe(next);
    }

    @log
    observeBuch(next: (buch: Buch) => void): any {
        return this.buchEmitter.subscribe(next);
    }

    @log
    observeError(next: (err: string|number) => void): any {
        return this.errorEmitter.subscribe(next);
    }

    /**
     * Buecher suchen
     * @param suchkriterien Die Suchkriterien
     */
    @log
    find(suchkriterien: BuchForm): void {
        const searchParams: URLSearchParams =
            this.suchkriterienToSearchParams(suchkriterien);
        const uri: string = this.baseUriBuecher;
        console.log(`BuecherService.find(): uri=${uri}`);

        const nextFn: (response: Response) => void = (response) => {
            console.log('BuecherService.find(): nextFn()');
            let buecher: Array<Buch> = this.responseToArrayBuch(response);
            this.buecherEmitter.emit(buecher);
        };
        const errorFn: (err: Response) => void = (err) => {
            const status: number = err.status;
            console.log(`BuecherService.find(): errorFn(): ${status}`);
            if (status === 400) {
                const body: string = err.text();
                if (isBlank(body)) {
                    this.errorEmitter.emit(status);
                } else {
                    // z.B. [PARAMETER][findByTitel.titel][Bei einem ...][x]
                    let errorMsg: string = body.split('[')[3];
                    errorMsg = errorMsg.substr(0, errorMsg.length - 2);
                    this.errorEmitter.emit(errorMsg);
                }
            } else {
                this.errorEmitter.emit(status);
            }
        };

        // Observable.subscribe() aus RxJS liefert ein Subscription Objekt,
        // mit dem man den Request abbrechen ("cancel") kann
        // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md
        // http://stackoverflow.com/questions/34533197/what-is-the-difference-between-rx-observable-subscribe-and-foreach
        // https://xgrommx.github.io/rx-book/content/observable/observable_instance_methods/subscribe.html
        this.http.get(uri, {search: searchParams}).subscribe(nextFn, errorFn);

        // Same-Origin-Policy verhindert Ajax-Datenabfragen an einen Server in
        // einer anderen Domain. JSONP (= JSON mit Padding) ermoeglicht die
        // Uebertragung von JSON-Daten über Domaingrenzen.
        // In Angular gibt es dafuer den Service Jsonp.
    }

    /*
     * Ein Buch anhand der ID suchen
     * @param id Die ID des gesuchten Buchs
     */
    @log
    findById(id: string): void {
        // Gibt es ein gepuffertes Buch mit der gesuchten ID?
        if (isPresent(this._buch) && this._buch._id === id) {
            console.log('BuecherService.findById(): Buch gepuffert');
            this.buchEmitter.emit(this._buch);
            return;
        }
        if (isBlank(id)) {
            console.log('BuecherService.findById(): Keine Id');
            return;
        }

        const uri: string = `${this.baseUriBuecher}/${id}`;
        const nextFn: ((response: Response) => void) = (response) => {
            this._buch = this.responseToBuch(response);
            this.buchEmitter.emit(this._buch);
        };
        const errorFn: (err: Response) => void = (err) => {
            const status: number = err.status;
            console.log(`BuecherService.findById(): errorFn(): ${status}`);
            this.errorEmitter.emit(status);
        };

        console.log('BuecherService.findById(): GET-Request');
        this.http.get(uri).subscribe(nextFn, errorFn);
    }

    /**
     * Ein neues Buch anlegen
     * @param neuesBuch Das JSON-Objekt mit dem neuen Buch
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    save(
        neuesBuch: Buch, successFn: (location: string|undefined) => void,
        errorFn: (status: number, text: string) => void): void {
        neuesBuch.datum = moment(new Date());

        const uri: string = this.baseUriBuecher;
        const body: string = JSON.stringify(neuesBuch.toJSON());
        console.log('body=', body);

        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        const authorization: string|undefined =
            this.iamService.getAuthorization();
        if (isPresent(authorization)) {
            headers.append('Authorization', authorization as string);
        }
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response) => {
            if (response.status === 201) {
                // TODO Das Response-Objekt enthaelt im Header NICHT "Location"
                successFn(undefined);
            }
        };
        // async. Error-Callback statt sync. try/catch
        const errorFnPost: ((errResponse: Response) => void) =
            (errResponse) => {
                if (isPresent(errorFn)) {
                    errorFn(errResponse.status, errResponse.text());
                }
            };
        this.http.post(uri, body, options).subscribe(nextFn, errorFnPost);
    }

    /**
     * Ein vorhandenes Buch aktualisieren
     * @param buch Das JSON-Objekt mit den aktualisierten Buchdaten
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    update(
        buch: Buch, successFn: () => void,
        errorFn: (status: number, text: string) => void|undefined): void {
        const uri: string = `${this.baseUriBuecher}`;
        const body: string = JSON.stringify(buch.toJSON());
        console.log('body=', body);

        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        const authorization: string|undefined =
            this.iamService.getAuthorization();
        if (isPresent(authorization)) {
            headers.append('Authorization', authorization as string);
        }
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response) =>
            successFn();
        const errorFnPut: ((errResponse: Response) => void) = (errResponse) => {
            if (isPresent(errorFn)) {
                errorFn(errResponse.status, errResponse.text());
            }
        };

        this.http.put(uri, body, options).subscribe(nextFn, errorFnPut);
    }

    /**
     * Ein Buch l&ouml;schen
     * @param buch Das JSON-Objekt mit dem zu loeschenden Buch
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    remove(
        buch: Buch, successFn: () => void|undefined,
        errorFn: (status: number) => void): void {
        const uri: string = `${this.baseUriBuecher}/${buch._id}`;
        const headers: Headers =
            new Headers({'Authorization': this.iamService.getAuthorization()});
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response) => {
            if (isPresent(successFn)) {
                successFn();
            }
        };
        const errorFnDelete: ((errResponse: Response) => void) =
            (errResponse) => {
                if (isPresent(errorFn)) {
                    errorFn(errResponse.status);
                }
            };


        this.http.delete(uri, options).subscribe(nextFn, errorFnDelete);
    }

    // http://www.sitepoint.com/15-best-javascript-charting-libraries
    // http://thenextweb.com/dd/2015/06/12/20-best-javascript-chart-libraries
    // http://mikemcdearmon.com/portfolio/techposts/charting-libraries-using-d3

    // D3 (= Data Driven Documents) ist das fuehrende Produkt fuer
    // Datenvisualisierung:
    //  initiale Version durch die Dissertation von Mike Bostock
    //  gesponsort von der New York Times, seinem heutigen Arbeitgeber
    //  basiert auf SVG = scalable vector graphics: Punkte, Linien, Kurven, ...
    //  ca 250.000 Downloads/Monat bei https://www.npmjs.com
    //  https://github.com/mbostock/d3 mit ueber 100 Contributors

    // Chart.js ist deutlich einfacher zu benutzen als D3
    //  basiert auf <canvas>
    //  ca 25.000 Downloads/Monat bei https://www.npmjs.com
    //  https://github.com/nnnick/Chart.js mit ueber 60 Contributors

    /**
     * Ein Balkendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    @log
    createBarChart(chartElement: HTMLCanvasElement): void {
        const uri: string = this.baseUriBuecher;
        const nextFn: ((response: Response) => void) = (response) => {
            if (response.status !== 200) {
                console.error('response=', response);
                return;
            }

            const buecher: Array<Buch> = this.responseToArrayBuch(response);
            const labels: Array<string> =
                buecher.map((buch: Buch) => buch._id) as Array<string>;
            console.log('BuecherService.createBarChart(): labels: ', labels);
            const ratingData: Array<number> =
                buecher.map((buch: Buch) => buch.rating) as Array<number>;

            const datasets: Array<ChartDataSet> =
                [{label: 'Bewertung', data: ratingData}];
            const config: ChartConfig = {
                type: 'bar',
                data: {labels: labels, datasets: datasets}
            };
            this.diagrammService.createChart(chartElement, config);
        };

        this.http.get(uri).subscribe(nextFn);
    }

    /**
     * Ein Liniendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    @log
    createLinearChart(chartElement: HTMLCanvasElement): void {
        const uri: string = this.baseUriBuecher;
        const nextFn: ((response: Response) => void) = (response) => {
            if (response.status !== 200) {
                console.error('response=', response);
                return;
            }

            const buecher: Array<Buch> = this.responseToArrayBuch(response);
            const labels: Array<string> =
                buecher.map((buch: Buch) => buch._id) as Array<string>;
            const ratingData: Array<number> =
                buecher.map((buch: Buch) => buch.rating) as Array<number>;

            const datasets: Array<ChartDataSet> =
                [{label: 'Bewertung', data: ratingData}];

            const config: ChartConfig = {
                type: 'line',
                data: {labels: labels, datasets: datasets}
            };

            this.diagrammService.createChart(chartElement, config);
        };

        this.http.get(uri).subscribe(nextFn);
    }

    /**
     * Ein Tortendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    @log
    createPieChart(chartElement: HTMLCanvasElement): void {
        const uri: string = this.baseUriBuecher;
        const nextFn: ((response: Response) => void) = (response) => {
            if (response.status !== 200) {
                console.error('response=', response);
                return;
            }

            const buecher: Array<Buch> = this.responseToArrayBuch(response);
            const labels: Array<string> =
                buecher.map((buch: Buch) => buch._id) as Array<string>;
            const ratingData: Array<number> =
                buecher.map((buch: Buch) => buch.rating) as Array<number>;

            const backgroundColor: Array<string> =
                new Array<string>(ratingData.length);
            const hoverBackgroundColor: Array<string> =
                new Array<string>(ratingData.length);
            _.times(ratingData.length, (i) => {
                backgroundColor[i] = this.diagrammService.getBackgroundColor(i);
                hoverBackgroundColor[i] =
                    this.diagrammService.getHoverBackgroundColor(i);
            });

            const data: any = {
                labels: labels,
                datasets: [{
                    data: ratingData,
                    backgroundColor: backgroundColor,
                    hoverBackgroundColor: hoverBackgroundColor
                }]
            };

            const config: ChartConfig = {type: 'pie', data: data};
            this.diagrammService.createChart(chartElement, config);
        };

        this.http.get(uri).subscribe(nextFn);
    }

    toString(): String {
        return `BuecherService: {buch: ${JSON.stringify(this._buch, null, 2)}}`;
    }

    /**
     * Ein Response-Objekt in ein Array von Buch-Objekten konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private suchkriterienToSearchParams(suchkriterien: BuchForm):
        URLSearchParams {
        const searchParams: URLSearchParams = new URLSearchParams();

        if (!isEmpty(suchkriterien.titel)) {
            searchParams.set('titel', suchkriterien.titel as string);
        }
        if (isPresent(suchkriterien.art)) {
            searchParams.set('art', suchkriterien.art);
        }
        if (isPresent(suchkriterien.rating)) {
            searchParams.set('rating', suchkriterien.rating.toString());
        }
        if (!isEmpty(suchkriterien.verlag)) {
            searchParams.set('verlag', suchkriterien.verlag as string);
        }
        if (isPresent(suchkriterien.javascript) && suchkriterien.javascript) {
            searchParams.set('javascript', 'true');
        }
        if (isPresent(suchkriterien.typescript) && suchkriterien.typescript) {
            searchParams.set('typescript', 'true');
        }
        return searchParams;
    }

    /**
     * Ein Response-Objekt in ein Array von Buch-Objekten konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private responseToArrayBuch(response: Response): Array<Buch> {
        const jsonArray: Array<BuchServer> =
            response.json() as Array<BuchServer>;
        return jsonArray.map((jsonObjekt: BuchServer) => {
            return Buch.fromServer(jsonObjekt);
        });
    }

    /**
     * Ein Response-Objekt in ein Buch-Objekt konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private responseToBuch(response: Response): Buch {
        const jsonObjekt: BuchServer = response.json() as BuchServer;
        return Buch.fromServer(jsonObjekt);
    }
}
