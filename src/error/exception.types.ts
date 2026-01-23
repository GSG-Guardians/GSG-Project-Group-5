export interface IPostgresDriverError extends Error {
  code: string;
  detail?: string;
  table?: string;
  column?: string;
  constraint?: string;
}
