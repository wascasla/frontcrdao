import { Proposal } from '../types/proposal';
import { ethers } from "ethers";
import abiDao from "../utils/dao-abi.json";
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppProvider';
import LoadingBox from './loadingBox';
import VoteProposalModal from './voteProposalModal';

const contractAbiDao = abiDao;
const contractAddressDAO = process.env.NEXT_PUBLIC_CONTRACT_DAO_ADDRESS || "";

interface Props {
    proposal: Proposal;
    getProposals: () => {}
  }

export default function ProposalItem({proposal, getProposals}:Props) {
    
    const [loadingTxn, setLoadingTxn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const formatStartDate = new Date(proposal.startTime * 1000).toLocaleString()
    const formatEndDate = new Date(proposal.endTime * 1000).toLocaleString();

  return (
    <>
    { loadingTxn && 
            <LoadingBox />
        }

{showModal && <VoteProposalModal getProposals={getProposals} proposalDescription={proposal.description} proposalId={proposal.id} setShowModalAction={setShowModal} />}
    
    <div className="max-w-sm p-6 m-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {proposal.description}
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Star date: {formatStartDate}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            End date: {formatEndDate}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Option A: {proposal.optionA}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Option B: {proposal.optionB}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Status: {proposal.statusProposal === 0 && Date.now() < (proposal.endTime * 1000) ? 'PENDING' : Date.now() > (proposal.endTime * 1000) && proposal.statusProposal === 0 ? 'CLOSED' : 'EXECUTED' }
          </p>
          <button 
            className={proposal.statusProposal === 1 || Date.now() > (proposal.endTime * 1000) ? "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" : "bg-blue-700 text-white font-bold py-2 px-4 rounded"}
            onClick={() => setShowModal(true)}
          >
            Vote
          </button>
        </div>    
    </>
  )
}
