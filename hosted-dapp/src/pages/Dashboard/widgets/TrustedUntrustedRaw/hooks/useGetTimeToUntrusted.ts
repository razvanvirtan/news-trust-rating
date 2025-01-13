import axios from 'axios';
import BigNumber from 'bignumber.js';
import { contractAddress } from 'config';
import { useGetNetworkConfig, useGetAccount } from 'hooks';
import { Address, AddressValue } from 'utils';
import { TrustedUntrustedResponseType } from '../types';

const decodeTime = (data: TrustedUntrustedResponseType) => {
  const returnValue = data.data.data.returnData[0];
  if (returnValue === '') {
    return 0;
  }

  if (!returnValue) {
    return null;
  }

  const decodedString = Buffer.from(returnValue, 'base64').toString('hex');
  return new BigNumber(decodedString, 16).toNumber();
};

export const useGetTimeToUntrusted = () => {
  const { network } = useGetNetworkConfig();
  const { address } = useGetAccount();

  const getTimeToUntrusted = async () => {
    try {
      const args = new AddressValue(new Address(address)).valueOf().hex();
      const { data } = await axios.post<TrustedUntrustedResponseType>(
        `${network.apiAddress}/vm-values/query`,
        {
          scAddress: contractAddress,
          funcName: 'getTimeToUntrusted',
          args: [args]
        }
      );

      return decodeTime(data);
    } catch (err) {
      return null;
    }
  };

  return getTimeToUntrusted;
};
