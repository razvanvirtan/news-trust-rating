import { useState, useCallback } from 'react';
import {
  deleteTransactionToast,
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { contractAddress } from 'config';
import { signAndSendTransactions } from 'helpers/signAndSendTransactions';
import {
  useGetAccountInfo,
  useGetNetworkConfig,
  useTrackTransactionStatus
} from 'hooks/sdkDappHooks';
import { GAS_PRICE, SessionEnum, VERSION } from 'localConstants';
import {
  VoteRawProps
} from 'types/vote.types';
import { newTransaction } from 'helpers/sdkDappHelpers';

type VoteTransactionProps = {
  type: SessionEnum;
  referrer:string;
};

const VOTE_TRUST_TRANSACTION_INFO = {
  processingMessage: 'Processing trust vote transaction',
  errorMessage: 'An error has occured during trust vote',
  successMessage: 'Trust vote transaction successful'
};

const VOTE_UNTRUST_TRANSACTION_INFO = {
  processingMessage: 'Processing untrust vote transaction',
  errorMessage: 'An error has occured during untrust vote',
  successMessage: 'Untrust vote transaction successful'
};

function stringToHex(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}


export const useSendVoteTransaction = ({
  type,
  referrer
}: VoteTransactionProps) => {
  // Needed in order to differentiate widgets between each other
  // By default sdk-dapp takes the last sessionId available which will display on every widget the same transaction
  // this usually appears on page refreshes
  const [voteSessionId, setVoteSessionId] = useState(
    sessionStorage.getItem(type)
  );

  const { network } = useGetNetworkConfig();
  const { address, account } = useGetAccountInfo();

  const transactionStatus = useTrackTransactionStatus({
    transactionId: voteSessionId ?? '0'
  });

  const clearAllTransactions = () => {
    removeAllSignedTransactions();
    removeAllTransactionsToSign();
    deleteTransactionToast(voteSessionId ?? '');
  };

  const referrer_hex = stringToHex(referrer);

  const sendVoteTrustTransaction = useCallback(
    async ({ callbackRoute }: VoteRawProps) => {
      clearAllTransactions();

      const voteTrustTransaction = newTransaction({
        value: "",
        data: 'vote@'+referrer_hex+'@01',
        receiver: contractAddress,
        gasLimit: 5000000,
        gasPrice: GAS_PRICE,
        chainID: "D",
        nonce: account.nonce,
        sender: address,
        version: VERSION
      });

      const sessionId = await signAndSendTransactions({
        transactions: [voteTrustTransaction],
        callbackRoute,
        transactionsDisplayInfo: VOTE_TRUST_TRANSACTION_INFO
      });

      sessionStorage.setItem(type, sessionId);
      setVoteSessionId(sessionId);
    },
    []
  );

  const sendVoteUntrustTransaction = useCallback(
    async ({ callbackRoute }: VoteRawProps) => {
      clearAllTransactions();

      const voteUntrustTransaction = newTransaction({
        value: '0',
        data: 'vote@'+referrer_hex+'@00',
        receiver: contractAddress,
        gasLimit: 60000000,
        gasPrice: GAS_PRICE,
        chainID: network.chainId,
        nonce: account.nonce,
        sender: address,
        version: VERSION
      });

      const sessionId = await signAndSendTransactions({
        transactions: [voteUntrustTransaction],
        callbackRoute,
        transactionsDisplayInfo: VOTE_UNTRUST_TRANSACTION_INFO
      });

      sessionStorage.setItem(type, sessionId);
      setVoteSessionId(sessionId);
    },
    []
  );

  return {
    sendVoteTrustTransaction: sendVoteTrustTransaction,
    sendVoteUntrustTransaction: sendVoteUntrustTransaction,
    transactionStatus
  };
};
