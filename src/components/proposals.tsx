import { Proposal } from "../types/proposal";
import ProposalItem from "./proposal";

interface Props {
    proposals: Proposal[]
    getProposals: () => {}
  }

export default function Proposals({proposals, getProposals}:Props) {
  return (
    <>
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Proposals
      </h5>
      <div className="mb-32 p-2 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        {proposals.length > 0 ? (
          proposals.map((prop) => 
            {return (<ProposalItem key={prop.id} proposal={prop} getProposals={getProposals}/>)}
          )
        ) : (
          <div>There are not Proposal to Vote yet</div>
        )}
      </div>
    </>
  );
}
