import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { interval } from 'rxjs/observable/interval';


@Injectable()
export class AppSettingsService {

    currentTimer: number = 4;
    constructor(private http: HttpClient) {
    }

    public getLiveLocation(): Observable<any> {
        return this.http.jsonp("http://api.open-notify.org/iss-now.json", "callback");
    }

    public getMomentumData(): Observable<any> {
        return this.http.get("../../assets/json/Test.json");
    }
}