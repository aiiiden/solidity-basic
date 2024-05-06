import hre from "hardhat";
import { BaseError, http } from "viem";
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
    await hre.viem.sendDeploymentTransaction("StructArray", [], {
      client: { wallet: deployer, public: publicClient },
    });

  console.log("- deployment tx hash:", deploymentTransaction.hash);
  console.log("- contract deployed to:", contract.address);

  await publicClient.waitForTransactionReceipt({
    hash: deploymentTransaction.hash,
  });

  for (let phase = 0; phase < 10000; ) {
    try {
      const txHash = await contract.write.signup(["aiiiden"]);

      console.log(`- SIGNUP TX ${phase + 1} : `, txHash);
      phase++;
    } catch (error) {
      if (error instanceof BaseError) {
        console.log("- ERROR : ", error.shortMessage);
      }

      continue;
    }

    // const receipt = await publicClient.waitForTransactionReceipt({
    //   hash: txHash,
    // });

    // console.log("- Gas used : ", receipt.gasUsed);
  }

  const user = await contract.read.getUser([deployer.account.address]);

  console.log("- User : ", user);
}

/**
 * [1차 스트레스 테스트 결과]
 * - 배포 주소 : 0xfe38892d8C1d48Ab75E9D3499C309BeB7Dc7209b
 * - 154번째에서 nonce 부족으로 실패함
 * - 가스비는 일정했음. 최초에만 조금 걸리고
 *
 * [2차 스트레스 테스트 결과]
 * - 배포 주소 : 0x8733628510c33f9e334cBAa42C9220DC0B2F8E83
 * - Fee 는 0.00001813 eth로 일정했음
 * - 가스비가 증가할거라고 생각했는데 그렇지 않은가보네;;;
 * - 373번째에서 nonce 부족으로 실패, 하지만 일단 계속 continue 되기는 하였음
 * - 397에도 발생
 * - 446에도 발생
 *
 * [결론]
 * - 그렇게 가스비가 드라마틱하게 올라가진 않는다아
 * - 500번까지 테스트했는데, 크게 바뀐건 없음
 */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
