import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as ApiModel from '../../../core/models/api.model';
import { Table } from './table';

describe('Table', () => {
  let fixture: ComponentFixture<Table>;
  let component: Table;

  const columns: (keyof ApiModel.ApiTableRow)[] = [
    'user_name',
    'node_name',
    'overall_ux_rating_avg',
    'login_delay_avg',
    'cpu_used_percent',
    'memory_used_percent',
  ];

  const xref: ApiModel.Xref = {
    user_name: 'User',
    user_id: 'User ID',
    node_name: 'Machine Name',
    node_id: 'Machine ID',
    overall_ux_rating_avg: 'UX Score',
    login_delay_avg: 'Login Delay',
    cpu_used_percent: 'CPU Used %',
    memory_used_percent: 'Memory Used %',
  };

  const rows: ApiModel.ApiTableRow[] = [
    {
      user_name: 'abigail.brown',
      user_id: '5158',
      node_name: 'vdipcoip-01.lab.lwl.corp',
      node_id: '2512',
      overall_ux_rating_avg: 'B-',
      login_delay_avg: '67',
      cpu_used_percent: '39.9',
      memory_used_percent: '66.5',
    },
    {
      user_name: 'bob.barker',
      user_id: '4171',
      node_name: 'vdirdp-06.lab.lwl.corp',
      node_id: '2607',
      overall_ux_rating_avg: 'B+',
      login_delay_avg: '46',
      cpu_used_percent: '34.9',
      memory_used_percent: '65.6',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('columns', columns);

    fixture.componentRef.setInput('rows', rows);

    fixture.componentRef.setInput('xref', xref);
  });

  function render(clickable = false): void {
    fixture.componentRef.setInput('clickable', clickable);

    fixture.detectChanges();
  }

  it('should create', () => {
    render();

    expect(component).toBeTruthy();
  });

  it('should render the configured columns', () => {
    render();

    const headers = fixture.nativeElement.querySelectorAll('th') as NodeListOf<HTMLElement>;

    expect(headers).toHaveLength(columns.length);
  });

  it('should render friendly column labels from xref', () => {
    render();

    const headers = Array.from(
      fixture.nativeElement.querySelectorAll('th') as NodeListOf<HTMLElement>,
    ).map((header) => header.textContent?.trim());

    expect(headers).toEqual([
      'User',
      'Machine Name',
      'UX Score',
      'Login Delay',
      'CPU Used %',
      'Memory Used %',
    ]);
  });

  it('should fall back to the column key when xref has no label', () => {
    const partialXref: ApiModel.Xref = {
      ...xref,
    };

    delete partialXref.user_name;

    fixture.componentRef.setInput('xref', partialXref);

    render();

    const firstHeader = fixture.nativeElement.querySelector('th') as HTMLElement;

    expect(firstHeader.textContent?.trim()).toBe('user_name');
  });

  it('should render row values', () => {
    render();

    const cells = Array.from(
      fixture.nativeElement.querySelectorAll('td') as NodeListOf<HTMLElement>,
    ).map((cell) => cell.textContent?.trim());

    expect(cells).toContain('abigail.brown');

    expect(cells).toContain('vdipcoip-01.lab.lwl.corp');

    expect(cells).toContain('B-');
    expect(cells).toContain('67');
    expect(cells).toContain('39.9');
    expect(cells).toContain('66.5');
  });

  it('should render one data row per row input', () => {
    render();

    const renderedRows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');

    expect(renderedRows).toHaveLength(rows.length);
  });

  it('should emit selected row when clickable row is clicked', () => {
    render(true);

    const emitSpy = vi.spyOn(component.rowSelected, 'emit');

    const renderedRows = fixture.nativeElement.querySelectorAll(
      'tr.mat-mdc-row',
    ) as NodeListOf<HTMLElement>;

    renderedRows[0].click();

    expect(emitSpy).toHaveBeenCalledWith(rows[0]);
  });

  it('should not emit selected row when row is not clickable', () => {
    render(false);

    const emitSpy = vi.spyOn(component.rowSelected, 'emit');

    const renderedRows = fixture.nativeElement.querySelectorAll(
      'tr.mat-mdc-row',
    ) as NodeListOf<HTMLElement>;

    renderedRows[0].click();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should make rows focusable when clickable', () => {
    render(true);

    const row = fixture.nativeElement.querySelector('tr.mat-mdc-row') as HTMLElement;

    expect(row.getAttribute('tabindex')).toBe('0');
  });

  it('should not make rows focusable when not clickable', () => {
    render(false);

    const row = fixture.nativeElement.querySelector('tr.mat-mdc-row') as HTMLElement;

    expect(row.hasAttribute('tabindex')).toBe(false);
  });

  it('should apply clickable class when clickable', () => {
    render(true);

    const row = fixture.nativeElement.querySelector('tr.mat-mdc-row') as HTMLElement;

    expect(row.classList.contains('clickable')).toBe(true);
  });

  it('should emit row on Enter when clickable', () => {
    render(true);

    const emitSpy = vi.spyOn(component.rowSelected, 'emit');

    const row = fixture.debugElement.query(By.css('tr.mat-mdc-row'));

    row.triggerEventHandler(
      'keydown.enter',
      new KeyboardEvent('keydown', {
        key: 'Enter',
      }),
    );

    expect(emitSpy).toHaveBeenCalledWith(rows[0]);
  });
  it('should emit row on Space when clickable', () => {
    render(true);

    const emitSpy = vi.spyOn(component.rowSelected, 'emit');

    const row = fixture.debugElement.query(By.css('tr.mat-mdc-row'));

    row.triggerEventHandler('keydown.space', {
      preventDefault: vi.fn(),
    });

    expect(emitSpy).toHaveBeenCalledWith(rows[0]);
  });

  it('should not emit row from keyboard when not clickable', () => {
    render(false);

    const emitSpy = vi.spyOn(component.rowSelected, 'emit');

    const row = fixture.debugElement.query(By.css('tr.mat-mdc-row'));

    row.triggerEventHandler(
      'keydown.enter',
      new KeyboardEvent('keydown', {
        key: 'Enter',
      }),
    );

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
