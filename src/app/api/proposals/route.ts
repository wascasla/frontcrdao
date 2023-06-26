import { ethers } from "ethers";
import abiDao from "../../../utils/dao-abi.json"

const contractAbiDao = abiDao
const addressContractDao = process.env.NEXT_PUBLIC_CONTRACT_DAO_ADDRESS || "";

export async function GET(request: Request) {
    const ethersAlchemyProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY)
     const myContract = new ethers.Contract(addressContractDao, contractAbiDao, ethersAlchemyProvider)
     const tx = await myContract.getProposals()

     return new Response(JSON.stringify(tx, (_, v) => typeof v === 'bigint' ? v.toString() : v))

  }



// import { ethers } from "ethers";
// import abiDao from "../../../utils/dao-abi.json"

// const contractAbiDao = abiDao
// const addressContractDao = process.env.NEXT_CONTRACT_DAO_ADDRESS || "";

// export async function GET(request, response) {
//   const ethersAlchemyProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_ALCHEMY)
//   const myContract = new ethers.Contract(addressContractDao, contractAbiDao, ethersAlchemyProvider)
//   const tx = await myContract.getProposals()

//   response.status(200).json(tx)
// }


 