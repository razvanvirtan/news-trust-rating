import axios from 'axios';
import { API_URL } from 'config';
import { Transaction } from 'types/sdkCoreTypes';

export const useGetTrustedTransaction = () => {
  return async () => {
    try {
      const { data } = await axios.post<Transaction>(
        '/Trusted-Untrusted/abi/Trusted',
        {},
        {
          baseURL: API_URL
        }
      );

      return data;
    } catch (err) {
      console.error('Unable to get Trusted Transaction', err);
      return null;
    }
  };
};
