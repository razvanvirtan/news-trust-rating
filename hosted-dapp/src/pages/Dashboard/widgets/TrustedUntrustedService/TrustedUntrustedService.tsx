import { useEffect, useState } from 'react';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { Button } from 'components/Button';
import { ContractAddress } from 'components/ContractAddress';
import { Label } from 'components/Label';
import { MissingNativeAuthError } from 'components/MissingNativeAuthError';
import { OutputContainer, TrustedUntrustedOutput } from 'components/OutputContainer';
import { getCountdownSeconds, setTimeRemaining } from 'helpers';
import { useGetPendingTransactions, useSendVoteTransaction } from 'hooks';
import { useGetLoginInfo } from 'hooks/sdkDappHooks';
import { SessionEnum } from 'localConstants';
import { SignedTransactionType, WidgetProps } from 'types';
import {
  useGetTimeToUntrusted,
  useGetTrustedTransaction,
  useGetUntrustedTransaction
} from './hooks';

// The transactions are being done by directly requesting to template-dapp service
export const TrustedUntrustedService = ({ callbackRoute }: WidgetProps) => {
  const [stateTransactions, setStateTransactions] = useState<
    SignedTransactionType[] | null
  >(null);
  const [hasTrusted, setHasTrusted] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const {
    sendVoteTrustTransaction,
    sendVoteUntrustTransaction,
    transactionStatus
  } = useSendVoteTransaction({
    type: SessionEnum.rawVoteSessionId
  });
  const getTimeToUntrusted = useGetTimeToUntrusted();
  const getTrustedTransaction = useGetTrustedTransaction();
  const getUntrustedTransaction = useGetUntrustedTransaction();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();

  const setSecondsRemaining = async () => {
    if (!tokenLogin?.nativeAuthToken) {
      return;
    }

    const secondsRemaining = await getTimeToUntrusted();
    const { canVote, timeRemaining } = setTimeRemaining(secondsRemaining);

    setHasTrusted(canVote);
    if (timeRemaining && timeRemaining >= 0) {
      setSecondsLeft(timeRemaining);
    }
  };

  const onSendTrustedTransaction = async () => {
    const TrustedTransaction = await getTrustedTransaction();

    if (!TrustedTransaction) {
      return;
    }

    await sendVoteTrustTransaction({
      callbackRoute
    });
  };

  const onSendUntrustedTransaction = async () => {
    const UntrustedTransaction = await getUntrustedTransaction();

    if (!UntrustedTransaction) {
      return;
    }

    await sendVoteUntrustTransaction({
      callbackRoute
    });
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

  if (!tokenLogin?.nativeAuthToken) {
    return <MissingNativeAuthError />;
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-start gap-2'>
          <Button
            disabled={!hasTrusted || hasPendingTransactions}
            onClick={onSendTrustedTransaction}
            data-testid='btnTrustedService'
            data-cy='transactionBtn'
          >
            <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
            Trusted
          </Button>

          <Button
            disabled={!UntrustedAllowed || hasTrusted || hasPendingTransactions}
            data-testid='btnUntrustedService'
            data-cy='transactionBtn'
            onClick={onSendUntrustedTransaction}
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
