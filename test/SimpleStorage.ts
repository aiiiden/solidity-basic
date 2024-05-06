import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SimpleStorage", function () {
  async function deploy() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const storage = await hre.viem.deployContract("SimpleStorage");

    const publicClient = await hre.viem.getPublicClient();

    return {
      owner,
      otherAccount,
      storage,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("배포가 되는가", async function () {
      const { storage } = await loadFixture(deploy);

      expect(storage.address).is.not.undefined;
    });

    it("값 저장되는가?", async function () {
      const { storage } = await loadFixture(deploy);

      const testValue: bigint = 12n;

      await storage.write.set([testValue]);

      const value = await storage.read.get();

      expect(value).to.be.equal(testValue);
    });

    it("값 변경되는가?", async function () {
      const { storage } = await loadFixture(deploy);

      const testValue: bigint = 12n;
      const testValue2: bigint = 24n;

      await storage.write.set([testValue]);
      await storage.write.set([testValue2]);

      const value = await storage.read.get();

      expect(value).to.be.equal(testValue2);
    });
  });
});
