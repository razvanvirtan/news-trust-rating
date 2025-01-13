import { useEffect, useState } from 'react';

import { useGetNetworkConfig } from 'hooks';
import { ContractFunction, ResultsParser, ProxyNetworkProvider } from 'utils';
import { smartContract } from 'utils/smartContract';
import { Address, AddressValue } from '../../../../../utils';
import { StringValue } from '@multiversx/sdk-core/out';

const resultsParser = new ResultsParser();

export const useGetTrustedAmount = (referrer:string) => {
  const { network } = useGetNetworkConfig();
  const [TrustedAmount, setTrustedAmount] = useState<string>('-');

  const proxy = new ProxyNetworkProvider(network.apiAddress);

  const getTrustedAmount = async () => {
    try {
      const query = smartContract.createQuery({
        func: new ContractFunction('getRating'),
        args: [new StringValue(referrer)]
      });
      console.log("Referrer: ", referrer);
      const queryResponse = await proxy.queryContract(query);

      const endpointDefinition = smartContract.getEndpoint('getTrustedAmount');

      const { firstValue: amount } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );

      setTrustedAmount(amount?.valueOf()?.toString(10));
    } catch (err) {
      console.error('Unable to call getTrustedAmount', err);
      setTrustedAmount("-1");
    }
  };

  useEffect(() => {
    getTrustedAmount();
  }, []);

  return TrustedAmount;
};
