"use client";

import Image from "next/image";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import abiDao from "../utils/dao-abi.json";
import { Proposal } from "../types/proposal";
import Proposals from "../components/proposals";
import CreateProposalModal from "../components/createProposalModal";
import { AppContext } from "../context/AppProvider";

const contractAbiDao = abiDao;
const contractAddressDAO = process.env.NEXT_PUBLIC_CONTRACT_DAO_ADDRESS || "";

export default function Home() {

  const { account, checkGoerli } = useContext(AppContext);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showModal, setShowModal] = useState(false);

  const getProposals = async () => {
    try {
      let listProposals: Proposal[] = [];
      const ethersAlchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_ALCHEMY
      );
      const myContract = new ethers.Contract(
        contractAddressDAO,
        contractAbiDao,
        ethersAlchemyProvider
      );
      const tx = await myContract.getProposals();
     
      const prop = JSON.stringify(tx, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      );
      if (prop.length > 0) {
        tx.forEach((key: any) => {
          listProposals.push({
            id: parseInt(key[0]),
            creator: key[1],
            startTime: parseInt(key[2]),
            endTime: parseInt(key[3]),
            description: key[4],
            optionA: parseInt(key[5]),
            optionB: parseInt(key[6]),
            statusProposal: parseInt(key[7]),
          });
        });

        setProposals(listProposals);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getProposals();
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center before:absolute before:h-[200px] before:w-[280px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <h2 className="mb-6 text-7xl font-bold">RDAO</h2>
      </div>
      <div className="mb-12 mt-20">
        <button
          type="button"
          onClick={handleShowModal}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create Proposal
        </button>
      </div>

      <Proposals getProposals={getProposals} proposals={proposals} />
      {showModal && <CreateProposalModal getProposals={getProposals} setShowModalAction={setShowModal} />}
    </div>
  );
}
