import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RespuestaTasa {
  provider: string;
  base: string;
  date: string;
  rates: { [moneda: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class TasaService {


  private readonly URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

  constructor(private http: HttpClient) {}

  public obtenerTasaDolar(): Observable<any> {
    return this.http.get<any>(this.URL);
  }
}