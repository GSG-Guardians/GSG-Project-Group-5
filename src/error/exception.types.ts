export type TPostgresDriverError = {
  code?: string; // SQLSTATE (e.g. 23505)
  detail?: string;
  table?: string;
  column?: string;
  constraint?: string;
  schema?: string;
};
