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
    await hre.viem.sendDeploymentTransaction("Mapping", [], {
      client: { wallet: deployer, public: publicClient },
    });

  console.log("- deployment tx hash:", deploymentTransaction.hash);
  console.log("- contract deployed to:", contract.address);

  await publicClient.waitForTransactionReceipt({
    hash: deploymentTransaction.hash,
  });

  const address = account.address;

  let phase = 1;

  while (phase <= 20) {
    const txHash = await contract.write.vote();

    console.log("- VOTE TX : ", txHash);

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    // 가스비
    console.log(`- [Phase ${phase}]gas used : `, receipt.gasUsed);

    phase++;
  }

  const count = await contract.read.getVoteCount([address]);

  console.log("- count : ", count);
}

/**
 * [결과]
 *
 * - 배포 주소 : 0x15b93183dAb7814D49E84E0b75D8013b9C8c2961
 * - gasUsed는 최초 1회 투표시 43566n 사용되었고, 이후 19회 투표시 각각 26466n 사용되었다.
 * - 최종 투표수 : 20
 * - 왜 최초 투표시 가스비가 더 많이 사용되었을까?
 *  + 매핑은 키가 존재하는지 확인하고, 존재하지 않으면 새로운 값을 추가하기 때문에 최초 투표시 가스비가 더 많이 사용되는것으로 생각됨
 */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
