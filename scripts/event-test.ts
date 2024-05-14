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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
