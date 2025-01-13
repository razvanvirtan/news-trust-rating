import axios from 'axios';
import { API_URL } from 'config';
import { TimeToUntrustedResponseType } from '../types';

export const useGetTimeToUntrusted = () => {
  const getTimeToUntrusted = async () => {
    try {
      const { data } = await axios.get<TimeToUntrustedResponseType>(
        '/Trusted-Untrusted/abi/time-to-Untrusted',
        {
          baseURL: API_URL
        }
      );

      return data.timeToUntrusted;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return getTimeToUntrusted;
};
