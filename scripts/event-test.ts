import hre from "hardhat";
import { http, parseEventLogs } from "viem";
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
  const account = privateKeyToAccount(process.env.PRIVATE_KEY_DEPLOYER);

  // Deployer wallet client
  const deployer = await hre.viem.getWalletClient(account.address, {
    account: account,
    chain: lineaSepolia,
    transport: http(),
  });

  console.log("- Deployer address:", deployer.account.address);

  const { contract, deploymentTransaction } =
    await hre.viem.sendDeploymentTransaction(
      "contracts/event-test.sol:EventTest",
      [],
      {
        client: { wallet: deployer, public: publicClient },
      }
    );

  console.log("- deployment tx hash:", deploymentTransaction.hash);
  console.log("- contract deployed to:", contract.address);

  await publicClient.waitForTransactionReceipt({
    hash: deploymentTransaction.hash,
  });

  // 1. Event 없이 진행 시
  const txHash = await contract.write.increase([10n]);

  console.log("- INCREASE TX : ", txHash);

  // 2. Event가 있는 경우
  const txHash2 = await contract.write.increaseWithEvent([10n]);
  console.log("- INCREASE WITH EVENT TX : ", txHash2);

  /**
   * https://sepolia.lineascan.build/tx/0x56f4b59289691e0fef312b28e5a3e70dac7912b27408687ba2a057cf20a84653
   * 로그가 없다
   *
   * https://sepolia.lineascan.build/tx/0xe03f4cfaac4659de086b52c57975d7c5be6374f64131ca0822b65621dc98f066
   * 로그가 있다
   */

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash2,
  });

  const [{ eventName, args }] = parseEventLogs({
    abi: contract.abi,
    logs: receipt.logs,
  });

  console.log("- parsed eventName : ", eventName);
  console.log("- parsed args : ", args);

  /**
   * {
        addr: '0x7263B9CfA04C99f689F6b122d640481748418e59',
        oldValue: 20n,
        newValue: 30n
        }
   */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
