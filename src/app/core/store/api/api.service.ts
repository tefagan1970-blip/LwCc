import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import * as ApiModel from '../../models/api.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://ux-demo.liquidware.com/lwl/api';

  public load(payload: ApiModel.ApiDataRequest): Observable<ApiModel.ApiResponse> {
    const body = new URLSearchParams();

    body.set('json', JSON.stringify(payload));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post(this.apiUrl, body.toString(), {
        headers,
        responseType: 'text',
      })
      .pipe(map((response) => JSON.parse(response) as ApiModel.ApiResponse));
  }
}
