import { ContractAddress } from 'components/ContractAddress';
import { Label } from 'components/Label';
import { SignedTransactionType } from 'types';
import { TransactionsOutput } from './TransactionsOutput';

type TrustedUntrustedOutputType = {
  timeRemaining: string;
  UntrustedAllowed: boolean;
  transactions?: SignedTransactionType[] | null;
};

export const TrustedUntrustedOutput = ({
  timeRemaining,
  UntrustedAllowed,
  transactions
}: TrustedUntrustedOutputType) => {
  if (!transactions) {
    return null;
  }

  return (
    <>
      <ContractAddress />
      <TransactionsOutput transactions={transactions} />
      {!UntrustedAllowed && (
        <p>
          <Label>Time remaining: </Label>
          <span className='text-red-600'>{timeRemaining}</span> until able to
          Untrusted
        </p>
      )}
    </>
  );
};
