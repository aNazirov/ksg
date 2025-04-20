type DATABASE = {
  PASSWORD: string;
  USER: string;
  DB: string;
  HOST: string;
  PORT: number;
};

type REDIS = {
  PASSWORD: string;
  USERNAME: string;
  DB: number;
  HOST: string;
  PORT: number;
};


export type AppConfig = {
  PORT: number;
  REDIS: REDIS;
  DATABASE: DATABASE;
};
