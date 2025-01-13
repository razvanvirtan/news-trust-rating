import axios from 'axios';
import { API_URL } from 'config';
import { Transaction } from 'types/sdkCoreTypes';

export const useGetUntrustedTransaction = () => {
  return async () => {
    try {
      const { data } = await axios.post<Transaction>(
        '/Trusted-Untrusted/abi/Untrusted',
        {},
        {
          baseURL: API_URL
        }
      );

      return data;
    } catch (err) {
      console.error('Unable to get Untrusted Transaction', err);
      return null;
    }
  };
};
