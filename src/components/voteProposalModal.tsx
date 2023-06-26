import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppContext } from "../context/AppProvider";
import { ethers } from "ethers";
import abiDao from "../utils/dao-abi.json";
import { toast } from "react-toastify";
import LoadingBox from "./loadingBox";

const contractAbiDao = abiDao;
const contractAddressDao = process.env.NEXT_PUBLIC_CONTRACT_DAO_ADDRESS || "";

export interface SetInformationProps {
  setShowModalAction: Dispatch<SetStateAction<boolean>>;
  proposalDescription: string;
  proposalId: number;
  getProposals: () => {};
}

export default function VoteProposalModal({
  proposalDescription,
  proposalId,
  setShowModalAction,
  getProposals
}: SetInformationProps) {
  const { account, checkGoerli } = useContext(AppContext);
  const [loadingTxn, setLoadingTxn] = useState(false);
  const [selectedOption, setSelectedOption] = useState("optionA"); // Estado para almacenar el valor seleccionado

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value); // Actualiza el valor seleccionado cuando cambia el botón de radio
  };
  const handleCloseModal = () => {
    setShowModalAction(false);
  };

  const voteProposal = async () => {
    if (account && checkGoerli) {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const daoContract = new ethers.Contract(
            contractAddressDao,
            contractAbiDao,
            signer
          );

          setLoadingTxn(true);
          const waveTxn = await daoContract.vote(
            proposalId,
            selectedOption === "optionA"
          );

          await waveTxn.wait();
          setLoadingTxn(false);

          daoContract.on("Voted", (proposalId, voter, inFavor, tokenId, event) => {
            let info = {
              proposalIdData: proposalId,
              voterData: voter,
              inFavorData: inFavor,
              tokenIdData: tokenId,
              data: event,
            };
            console.log(JSON.stringify(info, null, 4));
            toast.success(`NFT Minted: ${info.tokenIdData}`);
          });

          getProposals();
          toast.success("Successful vote!!!");
          handleCloseModal();
        } else {
          toast.error("Ethereum object doesn't exist!");
        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
        setLoadingTxn(false);
      }
    } else {
      toast.error(
        "Not authorized account found or you need connect to a Goerli Network"
      );
      setLoadingTxn(false);
    }
  };

  return (
    <div>
      {loadingTxn && <LoadingBox />}

      <div className="fixed top-0 left-0 z-40 w-screen h-screen bg-black opacity-50"></div>
      <div
        id="authentication-modal"
        // tabindex="-1"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0"
      >
        <div className="relative w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 mx-auto my-auto">
            <button
              onClick={handleCloseModal}
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-hide="authentication-modal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Vote Proposal: {proposalDescription} Id: {proposalId}
              </h3>
              <form className="space-y-6">
                <div className="flex items-center mb-4">
                  <input
                    id="default-radio-1"
                    type="radio"
                    value="optionA"
                    name="default-radio"
                    checked={selectedOption === "optionA"} // Comprueba si esta opción está seleccionada
                    onChange={handleOptionChange} // Maneja el cambio de opción
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Option A
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="default-radio-2"
                    type="radio"
                    value="optionB"
                    name="default-radio"
                    checked={selectedOption === "optionB"} // Comprueba si esta opción está seleccionada
                    onChange={handleOptionChange} // Maneja el cambio de opción
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-2"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Option B
                  </label>
                </div>

                <button
                  type="button"
                  //   type="submit"
                  //   onClick={createProposal}
                  onClick={voteProposal}
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Vote
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
