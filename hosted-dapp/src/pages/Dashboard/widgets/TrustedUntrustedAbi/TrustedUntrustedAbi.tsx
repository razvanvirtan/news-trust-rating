import { useEffect, useState } from 'react';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import moment from 'moment';
import { Button } from 'components/Button';
import { ContractAddress } from 'components/ContractAddress';
import { Label } from 'components/Label';
import { OutputContainer, TrustedUntrustedOutput } from 'components/OutputContainer';
import { getCountdownSeconds, setTimeRemaining } from 'helpers';
import { useGetPendingTransactions, useSendVoteTransaction } from 'hooks';
import { SessionEnum } from 'localConstants';
import { SignedTransactionType, WidgetProps } from 'types';
import { useGetTimeToVote, useGetTrustedAmount } from './hooks';

export const TrustedUntrustedAbi = ({ callbackRoute }: WidgetProps) => {
  const { hasPendingTransactions } = useGetPendingTransactions();
  const getTimeToUntrusted = useGetTimeToVote();
  const {
    sendVoteTrustTransaction,
    sendVoteUntrustTransaction,
    transactionStatus
  } = useSendVoteTransaction({
    type: SessionEnum.rawVoteSessionId
  });
  const TrustedAmount = useGetTrustedAmount();

  const [stateTransactions, setStateTransactions] = useState<
    SignedTransactionType[] | null
  >(null);
  const [hasTrusted, setHasTrusted] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const setSecondsRemaining = async () => {
    const secondsRemaining = await getTimeToUntrusted();
    const { canVote, timeRemaining } = setTimeRemaining(secondsRemaining);

    setHasTrusted(canVote);
    if (timeRemaining && timeRemaining >= 0) {
      setSecondsLeft(timeRemaining);
    }
  };

  const onSendTrustedTransaction = async () => {
    await sendVoteTrustTransaction({ callbackRoute });
  };

  const onSendUntrustedTransaction = async () => {
    await sendVoteUntrustTransaction({ callbackRoute });
  };

  const timeRemaining = moment()
    .startOf('day')
    .seconds(secondsLeft ?? 0)
    .format('mm:ss');

  const UntrustedAllowed = secondsLeft === 0;

  useEffect(() => {
    getCountdownSeconds({ secondsLeft, setSecondsLeft });
  }, [hasTrusted]);

  useEffect(() => {
    if (transactionStatus.transactions) {
      setStateTransactions(transactionStatus.transactions);
    }
  }, [transactionStatus]);

  useEffect(() => {
    setSecondsRemaining();
  }, [hasPendingTransactions]);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-start gap-2'>
          <Button
            disabled={!hasTrusted || hasPendingTransactions}
            onClick={onSendTrustedTransaction}
            data-testid='btnTrustedAbi'
            data-cy='transactionBtn'
            className='inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-blue-600 text-white hover:bg-blue-700 mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed'
          >
            <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
            Trusted
          </Button>

          <Button
            disabled={!UntrustedAllowed || hasTrusted || hasPendingTransactions}
            data-testid='btnUntrustedAbi'
            data-cy='transactionBtn'
            onClick={onSendUntrustedTransaction}
            className='inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-blue-600 text-white hover:bg-blue-700 mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed'
          >
            <FontAwesomeIcon icon={faArrowDown} className='mr-1' />
            Untrusted
          </Button>
        </div>
      </div>

      <OutputContainer>
        {!stateTransactions && (
          <>
            <ContractAddress />
            {!UntrustedAllowed && (
              <p>
                <Label>Time remaining: </Label>
                <span className='text-red-600'>{timeRemaining}</span> until able
                to Untrusted
              </p>
            )}
          </>
        )}

        <TrustedUntrustedOutput
          transactions={stateTransactions}
          UntrustedAllowed={UntrustedAllowed}
          timeRemaining={timeRemaining}
        />
      </OutputContainer>
    </div>
  );
};
