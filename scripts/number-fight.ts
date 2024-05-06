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
      "NumberFight",
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

  // 관리자 로직 실행
  const txHash1 = await contract.write.increment({
    account: deployer.account,
  });

  console.log("1. INCREMENT : ", txHash1);

  await publicClient.waitForTransactionReceipt({
    hash: txHash1,
  });

  const num1 = await contract.read.number();

  console.log("2. NUMBER : ", num1);

  // 유저 로직 실행
  const txHash2 = await contract.write.decrement({
    account: user.account,
  });

  console.log("3. DECREMENT : ", txHash2);

  await publicClient.waitForTransactionReceipt({
    hash: txHash2,
  });

  const num2 = await contract.read.number();

  console.log("4. NUMBER : ", num2);

  // 권한 변경
  const txHash3 = await contract.write.transferOwnership([
    user.account.address,
  ]);

  await publicClient.waitForTransactionReceipt({
    hash: txHash3,
  });

  const changedOwner = await contract.read.owner();

  console.log("5. OWNER CHANGED TO : ", changedOwner);

  const txHash4 = await contract.write.increment({
    account: user.account,
  });

  await publicClient.waitForTransactionReceipt({
    hash: txHash4,
  });

  const num3 = await contract.read.number();

  console.log("6. NUMBER : ", num3);
}

/**
 * [결과]
 *
 * - 배포 주소 : https://sepolia.lineascan.build/address/0x3f532a35346Cc9A587E29BbB75E59e3044af638a#code
 * - 성공적
 */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
