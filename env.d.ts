// typing process.env

declare namespace NodeJS {
  interface ProcessEnv {
    PRIVATE_KEY_DEPLOYER: `0x${string}`;

    PRIVATE_KEY_TESTER_1: `0x${string}`;
    LINEASCAN_API_KEY: string;
  }
}
