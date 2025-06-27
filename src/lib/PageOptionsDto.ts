export interface PageOptionsDto {
  readonly orderDirection?: 'ASC' | 'DESC';
  readonly orderColumn?: string;
  page?: number;
  limit?: number;
  readonly search?: string;
  readonly today?: boolean;
  readonly status?: 'Pendente' | 'Cancelada' | 'Confirmada';
  readonly startDate?: string;
}
