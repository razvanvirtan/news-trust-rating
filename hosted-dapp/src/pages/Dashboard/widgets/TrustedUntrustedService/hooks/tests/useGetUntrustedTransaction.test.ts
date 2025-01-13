import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { useGetUntrustedTransaction } from '../useGetUntrustedTransaction';

const UntrustedTransaction = {
  nonce: 10702,
  value: '0',
  receiver: 'erd1qqqqqqqqqqqqqpgqm6ad6xrsjvxlcdcffqe8w58trpec09ug9l5qde96pq',
  sender: 'erd1axhx4kenjlae6sknq7zjg2g4fvzavv979r2fg425p62wkl84avtqsf7vvv',
  gasPrice: 1000000000,
  gasLimit: 6000000,
  data: 'cG9uZw==',
  chainID: 'D',
  version: 1
};

describe('useGetUntrustedTransaction', () => {
  it('should return Untrusted transaction', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: UntrustedTransaction
    });

    const { result } = renderHook(() => useGetUntrustedTransaction());
    const transactionReceived = await result.current();

    expect(transactionReceived).toBe(UntrustedTransaction);
  });

  it('should return null', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('error'));

    const { result } = renderHook(() => useGetUntrustedTransaction());
    const transactionReceived = await result.current();

    expect(transactionReceived).toBeNull();
  });
});
