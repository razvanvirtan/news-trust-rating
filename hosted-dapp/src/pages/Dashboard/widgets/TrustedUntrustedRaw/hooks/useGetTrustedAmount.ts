import { useState, useEffect } from 'react';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { contractAddress } from 'config';
import { useGetNetworkConfig } from 'hooks';
import { TrustedUntrustedResponseType } from '../types';

const decodeAmount = (data: TrustedUntrustedResponseType) => {
  const returnValue = data.data.data.returnData[0];
  const decodedString = Buffer.from(returnValue, 'base64').toString('hex');

  return new BigNumber(decodedString, 16).toString(10);
};

export const useGetTrustedAmount = () => {
  const [TrustedAmount, setTrustedAmount] = useState<string>('0');
  const { network } = useGetNetworkConfig();

  const getTrustedAmount = async () => {
    try {
      const { data } = await axios.post<TrustedUntrustedResponseType>(
        `${network.apiAddress}/vm-values/query`,
        {
          scAddress: contractAddress,
          funcName: 'getTrustedAmount',
          args: []
        }
      );

      const amount = decodeAmount(data);
      setTrustedAmount(amount);
    } catch (err) {
      console.error('Unable to call getTrustedAmount - RAW', err);
    }
  };

  useEffect(() => {
    getTrustedAmount();
  }, []);

  return TrustedAmount;
};
