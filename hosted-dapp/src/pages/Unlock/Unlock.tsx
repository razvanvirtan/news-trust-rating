import {
  type ExtensionLoginButtonPropsType,
  type WebWalletLoginButtonPropsType,
  type OperaWalletLoginButtonPropsType,
  type LedgerLoginButtonPropsType,
  type WalletConnectLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  OperaWalletLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton as WebWalletUrlLoginButton,
  CrossWindowLoginButton
} from 'components/sdkDappComponents';
import { nativeAuth } from 'config';
import { RouteNamesEnum } from 'localConstants';
import { useNavigate } from 'react-router-dom';
import { AuthRedirectWrapper } from 'wrappers';
import {
  IframeButton,
  WebWalletLoginWrapper,
  XaliasLoginWrapper
} from './components';
import { IframeLoginTypes } from '@multiversx/sdk-web-wallet-iframe-provider/out/constants';
import { useIframeLogin } from '@multiversx/sdk-dapp/hooks/login/useIframeLogin';
import { useWindowSize } from 'hooks';

type CommonPropsType =
  | OperaWalletLoginButtonPropsType
  | ExtensionLoginButtonPropsType
  | WebWalletLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

// choose how you want to configure connecting to the web wallet
const USE_WEB_WALLET_CROSS_WINDOW = true;

const WebWalletLoginButton = USE_WEB_WALLET_CROSS_WINDOW
  ? CrossWindowLoginButton
  : WebWalletUrlLoginButton;

export const Unlock = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  
  
  const [onInitiateLogin, { isLoading }] = useIframeLogin({
    callbackRoute: RouteNamesEnum.dashboard,
    nativeAuth,
    onLoginRedirect: () => {
      const queryParams = new URLSearchParams(window.location.search).toString();
      console.log("Initial Unlock" + queryParams);
      navigate(`${RouteNamesEnum.dashboard}?${queryParams}`);
    }
  });

  const isMobile = width < 768;
  const commonProps: CommonPropsType = {
    callbackRoute: RouteNamesEnum.dashboard,
    nativeAuth,
    onLoginRedirect: () => {
      // use params from URL
      const queryParams = new URLSearchParams(window.location.search).get('referrer');
      console.log("Unlock" + queryParams);
      navigate(`${RouteNamesEnum.dashboard}?referrer=${queryParams}`);
    },
    disabled: isLoading
  };
  // console.log(window.location.search);
  // console.log(new URLSearchParams(window.location.search).toString());

  return (
    <AuthRedirectWrapper requireAuth={false} params={new URLSearchParams(window.location.search).toString()}>
      <div className='flex justify-center items-center'>
        <div
          className='flex flex-col p-6 items-center justify-center gap-4 rounded-xl bg-[#f6f8fa]'
          data-testid='unlockPage'
        >

          <div className='flex flex-col md:flex-row'>
            <WalletConnectLoginButton
              loginButtonText='Login with xPortal'
              {...commonProps}
            />

          </div>
        </div>
      </div>
    </AuthRedirectWrapper>
  );
};
