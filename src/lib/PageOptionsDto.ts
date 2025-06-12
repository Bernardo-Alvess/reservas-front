export interface PageOptionsDto {
  readonly orderDirection?: 'ASC' | 'DESC';
  readonly orderColumn?: string;
  page?: number;
  limit?: number;
  readonly search?: string;
}
