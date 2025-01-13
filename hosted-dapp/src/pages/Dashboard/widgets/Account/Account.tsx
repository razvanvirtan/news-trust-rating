import { useGetPingAmount} from '../PingPongAbi/hooks';
import { Button } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import { getCountdownSeconds } from 'helpers';
import { useSendVoteTransaction } from 'hooks';
import { SessionEnum } from 'localConstants';
import { SignedTransactionType, WidgetProps } from 'types';

export const Account = (referrer:string, { callbackRoute }: WidgetProps) => {

  const { sendVoteTrustTransaction, sendVoteUntrustTransaction, transactionStatus } =
    useSendVoteTransaction({
      type: SessionEnum.rawVoteSessionId,
      referrer: referrer.referrer
    });
  
  const trustScore = useGetPingAmount(referrer = referrer.referrer);

  const [stateTransactions, setStateTransactions] = useState<
    SignedTransactionType[] | null
  >(null);
  const [hasVote, setHasVote] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const onSendVoteTrustTransaction = async () => {
    await sendVoteTrustTransaction({ amount: trustScore, callbackRoute });
  };

  const onSendVoteUntrustTransaction = async () => {
    await sendVoteUntrustTransaction({ callbackRoute });
  };

  useEffect(() => {
    getCountdownSeconds({ secondsLeft, setSecondsLeft });
  }, [hasVote]);

  useEffect(() => {
    if (transactionStatus.transactions) {
      setStateTransactions(transactionStatus.transactions);
    }
  }, [transactionStatus]);

  return (
    <div style={{ textAlign: 'center', marginTop: '25%', backgroundColor: 'white',  borderRadius: '15px' }}>
      {trustScore === '-' ? (
        // Loading icon while trustScore is being fetched
        <div>
          <span>Loading...</span>
          <div
            style={{
              border: '4px solid #f3f3f3',
              borderRadius: '50%',
              borderTop: '4px solid #3498db',
              width: '40px',
              height: '40px',
              margin: '20px auto',
              animation: 'spin 2s linear infinite',
            }}
          ></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        // Display trustScore once it's available
        <div>
          {
            (Number.parseFloat(trustScore) / 10 >= 0 & Number.parseFloat(trustScore) / 10 < 25) ? (
              <div>
                <h1>Confidence Score</h1>
                <p style={{ fontSize: '40px', fontWeight: 'bold', color: 'red' }}>{Number.parseFloat(trustScore) / 10}%</p>
              </div>
            ) : (
              (Number.parseFloat(trustScore) / 10 >= 25 & Number.parseFloat(trustScore) / 10 < 50) ? (
                <div>
                  <h1>Confidence Score</h1>
                  <p style={{ fontSize: '40px', fontWeight: 'bold', color: 'orange' }}>{Number.parseFloat(trustScore) / 10}%</p>
                </div>
              ) : (
                (Number.parseFloat(trustScore) / 10 >= 50 & Number.parseFloat(trustScore) / 10 < 75) ? (
                    <div>
                      <h1><b>Confidence Score</b></h1>
                      <p style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        color: '#ffe033'
                      }}>{Number.parseFloat(trustScore) / 10}%</p>
                    </div>
                  ) : (
                    (Number.parseFloat(trustScore) / 10 >= 75 & Number.parseFloat(trustScore) / 10 <= 100) ? (
                        <div>
                          <h1>Confidence Score</h1>
                          <p style={{
                            fontSize: '40px',
                            fontWeight: 'bold',
                            color: 'green'
                          }}>{Number.parseFloat(trustScore) / 10}%</p>
                        </div>
                      ) : (
                        <div>
                          <h1>Confidence Score</h1>
                          <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>No trust vote for this URL yet!</p>
                        </div>
                      )
                  )
              )
            )
          }
        </div>
      )}
        <div style={{ textAlign: 'center', padding: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button
            onClick={onSendVoteTrustTransaction}
            data-cy='transactionBtn'
          >
            <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
            Trusted
          </Button>

          <Button
            data-cy='transactionBtn'
            onClick={onSendVoteUntrustTransaction}
          >
            <FontAwesomeIcon icon={faArrowDown} className='mr-1' />
            Untrusted
          </Button>
        </div>
    </div>
  );
};
