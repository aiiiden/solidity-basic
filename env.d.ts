// typing process.env

declare namespace NodeJS {
  interface ProcessEnv {
    PRIVATE_KEY: `0x${string}`;
    LINEASCAN_API_KEY: string;
  }
}
