import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { useGetTimeToUntrusted } from '../useGetTimeToUntrusted';

describe('useGetTimeToUntrusted', () => {
  it('should return 180 seconds', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        status: 'awaiting_Untrusted',
        timeToUntrusted: 180
      }
    });

    const { result } = renderHook(() => useGetTimeToUntrusted());
    const timeToUntrusted = await result.current();

    expect(timeToUntrusted).toBe(180);
  });

  it('should return undefined', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        status: 'not_yet_Trusteded'
      }
    });

    const { result } = renderHook(() => useGetTimeToUntrusted());
    const timeToUntrusted = await result.current();

    expect(timeToUntrusted).toBeUndefined();
  });

  it('should return null', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('error'));

    const { result } = renderHook(() => useGetTimeToUntrusted());

    const timeToUntrusted = await result.current();
    expect(timeToUntrusted).toBeNull();
  });
});
