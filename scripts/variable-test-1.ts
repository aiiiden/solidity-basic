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
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);

  // Deployer wallet client
  const deployer = await hre.viem.getWalletClient(account.address, {
    account: account,
    chain: lineaSepolia,
    transport: http(),
  });

  console.log("- Deployer address:", deployer.account.address);

  const { contract, deploymentTransaction } =
    await hre.viem.sendDeploymentTransaction("VariableTest1", [], {
      client: { wallet: deployer, public: publicClient },
    });

  console.log("- deployment tx hash:", deploymentTransaction.hash);
  console.log("- SimpleStorage deployed to:", contract.address);

  await publicClient.waitForTransactionReceipt({
    hash: deploymentTransaction.hash,
  });

  const localVar = await contract.read.testLocal();

  console.log("- 지역변수 local 의 값 : ", localVar);

  const message = await contract.read.message();

  console.log("- Public 상태변수 message의 값 : ", message);

  const txHash1 = await contract.write.setMessage(["안녕?"]);

  console.log("- SET MESSAGE TX : ", txHash1);

  await publicClient.waitForTransactionReceipt({
    hash: txHash1,
  });

  const changedMessage = await contract.read.message();

  console.log("- 변경된 message 값 : ", changedMessage);

  const number = await contract.read.getNum();

  console.log("- Private 상태변수 number의 값 : ", number);

  const txHash2 = await contract.write.setNum([12n]);

  console.log("- SET NUM TX : ", txHash2);

  await publicClient.waitForTransactionReceipt({
    hash: txHash2,
  });

  const changedNumber = await contract.read.getNum();

  console.log("- 변경된 number의 값 : ", changedNumber);

  const blockTimestamp = await contract.read.getBlockTimestamp();

  console.log("- 전역변수 block 의 timestamp 값 : ", blockTimestamp);

  const sender = await contract.read.getSender();
  // 0x0000000000000000000000000000000000000000 로 나오네??
  // 왜 영주소 일까...?

  console.log("- 전역변수 msg의 sender 값 : ", sender);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
