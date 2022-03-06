import { MerkleTree } from "merkletreejs";
import keccak256 from 'keccak256';

const generateProof =  async (address, list) => {
    const leaves = list.map(x => keccak256(x))
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    // console.log(tree.getRoot().toString('hex'))
    const leaf = await keccak256(address)

    return tree.getHexProof(leaf)
}
  
export { generateProof }