declare module "bun" {
  interface Env {
    // # mssql configuration
    USER: string;
    PASSWORD: string;
    HOST: string;
    DATABASE: string;
    PORT: number;
  }
}