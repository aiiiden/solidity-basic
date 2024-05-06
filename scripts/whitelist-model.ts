import hre from "hardhat";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { lineaSepolia } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const publicClient = await hre.viem.getPublicClient({
    chain: lineaSepolia,
    transport: http(),
  });

  // Deployer address PK
  const deployerAccount = privateKeyToAccount(process.env.PRIVATE_KEY_DEPLOYER);
  const userAccount = privateKeyToAccount(process.env.PRIVATE_KEY_TESTER_1);

  // Deployer wallet client
  const deployer = await hre.viem.getWalletClient(deployerAccount.address, {
    account: deployerAccount,
    chain: lineaSepolia,
    transport: http(),
  });

  const user = await hre.viem.getWalletClient(userAccount.address, {
    account: userAccount,
    chain: lineaSepolia,
    transport: http(),
  });

  console.log("- Deployer address:", deployer.account.address);
  console.log("- User address:", user.account.address);

  const { contract, deploymentTransaction } =
    await hre.viem.sendDeploymentTransaction(
      "WhitelistModel",
      [deployer.account.address],
      {
        client: {
          wallet: deployer,
          public: publicClient,
        },
      }
    );

  console.log("- deployment tx hash:", deploymentTransaction.hash);
  console.log("- contract deployed to:", contract.address);

  await publicClient.waitForTransactionReceipt({
    hash: deploymentTransaction.hash,
  });

  // 유저가 화이트리스팅 되어있는지 여부
  const isUserWhitelisted = await contract.read.whitelist([
    user.account.address,
  ]);

  console.log("1. BEFORE ELIGIBILITY : ", isUserWhitelisted);

  // 관리자 로직 실행
  const txHash1 = await contract.write.addWhitelist([[user.account.address]], {
    account: deployer.account,
  });

  console.log("2. ADD WHITELIST : ", txHash1);

  await publicClient.waitForTransactionReceipt({
    hash: txHash1,
    confirmations: 3,
  });

  const isUserAfterWhitelisted = await contract.read.whitelist([
    user.account.address,
  ]);

  console.log("3. AFTER ELIGIBILITY : ", isUserAfterWhitelisted);

  // 화이트 리스팅된 유저가 실행
  const txHash2 = await contract.write.greeting(["안녕?"], {
    account: user.account,
  });

  console.log("3. GREET : ", txHash2);
}

/**
 * [결과]
 * - 배포 주소 : https://sepolia.lineascan.build/address/0xb0EA8B57695942F4856520136F907D36319C527A#code
 * - 성공적
 */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
