export interface ApiResponse {
  sqlcount: string[];
  'Liquidware Labs': string;
  timestamp_now: string;
  query_id: string;
  inspector: string;
  inspector_id: string;
  inspector_name: string;
  last_cid_date: string;
  basis: string;
  simple_basis: string;
  basis_columns: string;
  where_zoom: string;
  bread_crumbs: string;
  resolution: string;
  report_date: string;
  time_res: string;
  start_date_db: string;
  end_date_db: string;
  timezone_hub: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  time_used: string;
  duration: string;
  from_rollups: string;
  use_more_sql: string;
  language: string;
  return_size: string;
  return_count: string;
  rating_count: string;
  limit: string;
  page: string;
  pagination: string;
  total_rows: string;
  columns: string;
  validated_by: string;
  ip_address: string;
  ip_match: string;
  output: string;
  sort_used: string;
  basis_list: string;
  table: ApiTableRow[];
  metric_stats: MetricStat[];
  xref: Xref;
}

export interface ApiTableRow {
  end_date?: string;
  user_name: string;
  user_id: string;
  node_name: string;
  node_id: string;
  overall_ux_rating_avg: string;
  login_delay_avg: string;
  cpu_used_percent: string;
  memory_used_percent: string;
}

export interface MetricStat {
  stat_type: MetricStatType;
  cpu_used_percent: string;
  login_delay_avg: string;
  memory_used_percent: string;
  overall_ux_rating_avg: string;
}

export type MetricStatType = 'avg' | 'max' | 'min' | 'stddev';

export type Xref = Partial<Record<keyof ApiTableRow, string>>;

export interface ApiDataRequest {
  inspector: string;
  basis: string;
  columns: string;
  date: string;
  sort_col: string;
  sort_order: string;

  user_name?: string;
  node_name?: string;
  resolution?: 'cid';
}
