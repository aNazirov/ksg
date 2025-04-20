type DATABASE = {
  PASSWORD: string;
  USER: string;
  DB: string;
  HOST: string;
  PORT: number;
};

export type AppConfig = {
  PORT: number;
  DATABASE: DATABASE;
};
