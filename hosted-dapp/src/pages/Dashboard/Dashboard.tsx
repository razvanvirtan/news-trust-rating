import { contractAddress } from 'config';
import { AuthRedirectWrapper } from 'wrappers';
import {
  Account,
  PingPongAbi,
  SignMessage,
  NativeAuth,
  BatchTransactions,
  PingPongRaw,
  PingPongService,
  Transactions
} from './widgets';
import { useScrollToElement } from 'hooks';
import { Widget } from './components';
import { WidgetType } from 'types/widget.types';

const WIDGETS: WidgetType[] = [
  {
    title: 'Account',
    widget: Account,
    description: 'Connected account details',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  }
]

export const Dashboard = () => {
  useScrollToElement();
  console.log("Dashboard ",new URLSearchParams(window.location.search).get('referrer'));
  return (
    <AuthRedirectWrapper>
      <div className='flex flex-col gap-6 max-w-3xl w-full'>
      {WIDGETS.map((element) => (
      <Widget key = "Account" 
      props={{referrer: new URLSearchParams(window.location.search).get('referrer') || '_1_'}} {...element}/>
      ))}
      </div>
    </AuthRedirectWrapper>
  );
};
