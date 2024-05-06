import hre from "hardhat";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { lineaSepolia } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("------");

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

  console.log("Deployer address:", deployer.account.address);

  // 컨트랙트 배포 구문이긴 하지만,
  // console log가 안먹어서 sendDeploymentTransaction 로 대체

  //   const contract = await hre.viem.deployContract("SimpleStorage", [], {
  //     client: {
  //       wallet: deployer,
  //     },
  //     confirmations: 0,
  //   });

  const { contract, deploymentTransaction } =
    await hre.viem.sendDeploymentTransaction("SimpleStorage", [], {
      client: { wallet: deployer, public: publicClient },
    });

  console.log("- deployment tx hash:", deploymentTransaction.hash);
  console.log("- SimpleStorage deployed to:", contract.address);

  await publicClient.waitForTransactionReceipt({
    hash: deploymentTransaction.hash,
  });

  // SimpleStorage 의 set 함수 호출
  const testValue = 12n;

  const txHash1 = await contract.write.set([testValue]);

  console.log("- set tx hash:", txHash1);

  await publicClient.waitForTransactionReceipt({
    hash: txHash1,
  });

  // SimpleStorage 의 get 함수 호출
  const value = await contract.read.get();

  console.log("- value:", value.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
