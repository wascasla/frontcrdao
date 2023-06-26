"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { networks } from "../utils/networks";
import abiVotingToken from "../utils/votingToken-abi.json";


// declare var window: any

export const AppContext = createContext<{
  account: string;
  connectWallet: () => {};
  error: string;
  checkGoerli: boolean;
  changeNetworkToGoerli: () => {};
  totalVotingToken: number;
}>({ account: "", connectWallet: async () => {}, error: "", checkGoerli: false, changeNetworkToGoerli: async () => {}, totalVotingToken: 0  });
const abiContractVotingToken = abiVotingToken;

const contractAddressVotingToken = process.env.NEXT_PUBLIC_CONTRACT_VOTING_TOKEN_ADDRESS || "";

// const { ethereum } = typeof window !== "undefined" ? window : {};
const ethereum = (typeof window !== 'undefined' && window.ethereum) || null;


// const { ethereum } = window;

const AppProvider = ({ children }: {
    children: React.ReactNode;
  }) => {
    const [account, setAccount] = useState("");
    const [error, setError] = useState("");
    const [totalVotingToken, setTotalVotingToken] = useState(0);
    const [loadingTxn, setLoadingTxn] = useState(false);
    const [checkGoerli, setCheckGoerli] = useState(false);
  
    const checkEthereumExists = () => {
      if (!ethereum) {
        toast.error("Please Install MetaMask.");
        setError("Please Install MetaMask.");
        return false;
      }
      return true;
    };

    const getTotalVotingToken = async () => {
      try {
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const votingTokenContract = new ethers.Contract(
            contractAddressVotingToken,
            abiContractVotingToken,
            signer
          );
          let count = await votingTokenContract.balanceOf(account);
          setTotalVotingToken(Number(ethers.utils.formatEther(count)));
        } else {
          toast.error("Ethereum object doesn't exist!");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    const getConnectedToGoerli = async () => {
      try {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const network = await provider.getNetwork();
          if (network.name !== "goerli") {
            setCheckGoerli(false);
            toast.warning("You need to connect to Goerli!");
          } else {
            setCheckGoerli(true);
          }
        } else {
          toast.warning("Ethereum object doesn't exist!");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    const changeNetworkToGoerli = async () => {
      try {
        if (!ethereum) throw new Error("No crypto wallet found");
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              ...networks["goerli"],
            },
          ],
        });
        await getConnectedToGoerli();
      } catch (error: any) {
        toast.error(error.message);
      }
    };
  
    const getConnectedAccounts = async () => {
      setError("");
      try {
        const accounts = await ethereum.request({
          method: "eth_accounts",
        });
        setAccount(accounts[0]);
      } catch (error: any) {
        setError(error.message);
      }
    };
  
    const connectWallet = async () => {
      setError("");
      if (checkEthereumExists()) {
        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);
          changeNetworkToGoerli();
        } catch (error: any) {
          toast.error(error.message);
          setError(error.message);
        }
      }
    };   
  
    useEffect(() => {
      if (checkEthereumExists()) {
        ethereum.on("accountsChanged", getConnectedAccounts);
        getConnectedAccounts();
      }
      return () => {
        ethereum.removeListener("accountsChanged", getConnectedAccounts);
      };
    }, []);

    useEffect(() => {
      if (account && checkGoerli) {
        getTotalVotingToken();
      }
    }, [account, checkGoerli])
    
  
    return (
      <AppContext.Provider
        value={{ account, connectWallet, error, checkGoerli, changeNetworkToGoerli, totalVotingToken }}
      >
        {children}
      </AppContext.Provider>
    );
  };
  
  export default AppProvider;