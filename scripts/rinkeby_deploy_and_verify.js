const { ethers } = require('hardhat');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = require("./cyberlionz");
require('dotenv').config({path:__dirname+'/.env'});

const path = "./scripts/cyberlionz.js";

async function main() {

  // Deploy CyberLionzCubz
  const CyberLionzCubz = await ethers.getContractFactory("CyberLionzCubzMock");
  const cyberLionzCubz = await CyberLionzCubz.deploy(
      ...args
  )
  await cyberLionzCubz.deployed();
  console.log("CyberLionzCuz deployed to address:", cyberLionzCubz.address)

  console.log("Waiting for a while")
  await new Promise(r => setTimeout(r, 60000));

  await verify(cyberLionzCubz.address, "rinkeby", path)
}

async function verify(address, network, path) {
    try {
      const { stdout, stderr } = await exec(`npx hardhat verify ${address} --network ${network} --constructor-args ${path} `);
      if(stderr) return console.log('stderr:', stderr);
      console.log('stdout:', stdout);
    } catch (e) {
      console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  