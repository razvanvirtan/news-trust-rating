import { useGetAccount, useGetNetworkConfig } from 'hooks';
import {
  Address,
  AddressValue,
  ContractFunction,
  ResultsParser,
  ProxyNetworkProvider
} from 'utils';
import { smartContract } from 'utils/smartContract';

const resultsParser = new ResultsParser();

export const useGetTimeToVote = () => {
  const { network } = useGetNetworkConfig();
  const { address } = useGetAccount();

  const getTimeToVote = async () => {
    try {
      const query = smartContract.createQuery({
        func: new ContractFunction('getTimeToVote'),
        args: [new AddressValue(new Address(address))]
      });
      const provider = new ProxyNetworkProvider(network.apiAddress);
      const queryResponse = await provider.queryContract(query);
      const endpointDefinition = smartContract.getEndpoint('getTimeToVote');
      const { firstValue } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );
      const secondsRemaining: number = firstValue?.valueOf()?.toNumber();

      return secondsRemaining;
    } catch (err) {
      console.error('Unable to call getTimeToVote', err);
    }
  };

  return getTimeToVote;
};
