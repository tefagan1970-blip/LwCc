import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as ApiModel from '../../models/api.model';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST form-urlencoded JSON payload', () => {
    const payload: ApiModel.ApiDataRequest = {
      inspector: '0',
      basis: 'users,machines',
      columns: 'overall_ux_rating_avg',
      date: '1 weeks ago',
      sort_col: 'user_name',
      sort_order: '1',
    };

    const response = {
      columns: 'overall_ux_rating_avg',
      table: [],
    } as unknown as ApiModel.ApiResponse;

    service.load(payload).subscribe({
      next: (result: ApiModel.ApiResponse) => {
        expect(result).toEqual(response);
      },
    });

    const request = httpMock.expectOne('https://ux-demo.liquidware.com/lwl/api');

    expect(request.request.method).toBe('POST');

    expect(request.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');

    const body = new URLSearchParams(request.request.body);

    expect(body.get('json')).toBe(JSON.stringify(payload));

    request.flush(JSON.stringify(response));
  });

  it('should include detail filters in request payload', () => {
    const payload: ApiModel.ApiDataRequest = {
      inspector: '0',
      basis: 'users,machines',
      columns: 'overall_ux_rating_avg',
      date: '1 weeks ago',
      sort_col: 'user_name',
      sort_order: '1',
      user_name: 'abigail.brown',
      node_name: 'machine-01',
      resolution: 'cid' as const,
    };

    service.load(payload).subscribe();

    const request = httpMock.expectOne('https://ux-demo.liquidware.com/lwl/api');

    const body = new URLSearchParams(request.request.body);

    const json = JSON.parse(body.get('json') ?? '{}');

    expect(json.user_name).toBe('abigail.brown');

    expect(json.node_name).toBe('machine-01');

    expect(json.resolution).toBe('cid');

    request.flush(
      JSON.stringify({
        columns: '',
        table: [],
      }),
    );
  });
});
