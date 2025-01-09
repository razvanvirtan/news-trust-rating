import { useEffect, useState } from 'react';

import { useGetNetworkConfig } from 'hooks';
import { ContractFunction, ResultsParser, ProxyNetworkProvider } from 'utils';
import { smartContract } from 'utils/smartContract';
import { Address, AddressValue } from '../../../../../utils';
import { StringValue } from '@multiversx/sdk-core/out';

const resultsParser = new ResultsParser();

export const useGetPingAmount = () => {
  const { network } = useGetNetworkConfig();
  const [pingAmount, setPingAmount] = useState<string>('-');

  const proxy = new ProxyNetworkProvider(network.apiAddress);

  const getPingAmount = async () => {
    try {
      const query = smartContract.createQuery({
        func: new ContractFunction('getRating'),
        args: [new StringValue('a.com')]
      });
      const queryResponse = await proxy.queryContract(query);

      const endpointDefinition = smartContract.getEndpoint('getPingAmount');

      const { firstValue: amount } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );

      setPingAmount(amount?.valueOf()?.toString(10));
    } catch (err) {
      console.error('Unable to call getPingAmount', err);
      setPingAmount("-1");
    }
  };

  useEffect(() => {
    getPingAmount();
  }, []);

  return pingAmount;
};
