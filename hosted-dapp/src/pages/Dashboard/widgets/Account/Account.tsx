import { useGetPingAmount, useGetTimeToPong } from '../PingPongAbi/hooks';
import { Button } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { ContractAddress } from 'components/ContractAddress';
import { Label } from 'components/Label';
import { OutputContainer, PingPongOutput } from 'components/OutputContainer';
import { getCountdownSeconds, setTimeRemaining } from 'helpers';
import { useGetPendingTransactions, useSendPingPongTransaction } from 'hooks';
import { SessionEnum } from 'localConstants';
import { SignedTransactionType, WidgetProps } from 'types';

export const Account = (referrer:string, { callbackRoute }: WidgetProps) => {

  const getTimeToPong = useGetTimeToPong();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { sendPingTransaction, sendPongTransaction, transactionStatus } =
    useSendPingPongTransaction({
      type: SessionEnum.rawPingPongSessionId,
      referrer: referrer.referrer
    });
  
  const pingAmount = useGetPingAmount(referrer = referrer.referrer);

  const [stateTransactions, setStateTransactions] = useState<
    SignedTransactionType[] | null
  >(null);
  const [hasPing, setHasPing] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const setSecondsRemaining = async () => {
    const secondsRemaining = await getTimeToPong();
    const { canPing, timeRemaining } = setTimeRemaining(secondsRemaining);

    setHasPing(canPing);
    if (timeRemaining && timeRemaining >= 0) {
      setSecondsLeft(timeRemaining);
    }
  };

  const onSendPingTransaction = async () => {
    await sendPingTransaction({ amount: pingAmount, callbackRoute });
  };

  const onSendPongTransaction = async () => {
    await sendPongTransaction({ callbackRoute });
  };

  const timeRemaining = moment()
    .startOf('day')
    .seconds(secondsLeft ?? 0)
    .format('mm:ss');

  useEffect(() => {
    getCountdownSeconds({ secondsLeft, setSecondsLeft });
  }, [hasPing]);

  useEffect(() => {
    if (transactionStatus.transactions) {
      setStateTransactions(transactionStatus.transactions);
    }
  }, [transactionStatus]);

  useEffect(() => {
    setSecondsRemaining();
  }, [hasPendingTransactions]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {pingAmount === '-' ? (
        // Loading icon while pingAmount is being fetched
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
              animation: 'spin 2s linear infinite'
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
        // Display pingAmount once it's available
        <div>
          {
            (Number.parseFloat(pingAmount) / 10 >= 0 & Number.parseFloat(pingAmount) / 10 < 25) ? (
              <div>
                <h1>Confidence Score</h1>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>{Number.parseFloat(pingAmount) / 10}%</p>
              </div>
            ) : (
              (Number.parseFloat(pingAmount) / 10 >= 25 & Number.parseFloat(pingAmount) / 10 < 50) ? (
                <div>
                  <h1>Confidence Score</h1>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'orange' }}>{Number.parseFloat(pingAmount) / 10}%</p>
                </div>
              ) : (
                (Number.parseFloat(pingAmount) / 10 >= 50 & Number.parseFloat(pingAmount) / 10 < 75) ? (
                    <div>
                      <h1>Confidence Score</h1>
                      <p style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'yellow'
                      }}>{Number.parseFloat(pingAmount) / 10}%</p>
                    </div>
                  ) : (
                    (Number.parseFloat(pingAmount) / 10 >= 75 & Number.parseFloat(pingAmount) / 10 <= 100) ? (
                        <div>
                          <h1>Confidence Score</h1>
                          <p style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'green'
                          }}>{Number.parseFloat(pingAmount) / 10}%</p>
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
      <div className='flex flex-col gap-2'>
              <div className='flex justify-start gap-2'>
                <Button
                  disabled={hasPendingTransactions}
                  onClick={onSendPingTransaction}
                  data-cy='transactionBtn'
                >
                  <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
                  Trusted
                </Button>
      
                <Button
                  disabled={hasPendingTransactions}
                  data-cy='transactionBtn'
                  onClick={onSendPongTransaction}
                >
                  <FontAwesomeIcon icon={faArrowDown} className='mr-1' />
                  Untrusted
                </Button>
              </div>
            </div>
    </div>
  );
};
