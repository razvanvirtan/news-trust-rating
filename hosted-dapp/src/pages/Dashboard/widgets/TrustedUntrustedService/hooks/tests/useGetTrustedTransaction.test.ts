import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { useGetTrustedTransaction } from '../useGetTrustedTransaction';

const TrustedTransaction = {
  nonce: 10705,
  value: '1000000000000000000',
  receiver: 'erd1qqqqqqqqqqqqqpgqm6ad6xrsjvxlcdcffqe8w58trpec09ug9l5qde96pq',
  sender: 'erd1axhx4kenjlae6sknq7zjg2g4fvzavv979r2fg425p62wkl84avtqsf7vvv',
  gasPrice: 1000000000,
  gasLimit: 6000000,
  data: 'cGluZw==',
  chainID: 'D',
  version: 1
};

describe('useGetTrustedTransaction', () => {
  it('should return Trusted transaction', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: TrustedTransaction
    });

    const { result } = renderHook(() => useGetTrustedTransaction());
    const transactionReceived = await result.current();

    expect(transactionReceived).toBe(TrustedTransaction);
  });

  it('should return null', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('error'));

    const { result } = renderHook(() => useGetTrustedTransaction());
    const transactionReceived = await result.current();

    expect(transactionReceived).toBeNull();
  });
});
