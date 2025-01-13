export type TimeToUntrustedResponseType = {
  status: 'not_yet_Trusted' | 'awaiting_Untrusted';
  timeToUntrusted?: number;
};
