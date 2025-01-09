import { useGetPingAmount } from '../PingPongAbi/hooks';

export const Account = () => {
  const pingAmount = useGetPingAmount();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {pingAmount === '-' ? (
        // Loading icon while pingAmount is being fetched
        <div>
          <span>Loading...</span>
          <div
            style={{
              border: '4px solid #f3f3f3',
              borderRadius: '50%',
              borderTop: '4px solid #3498db',
              width: '40px',
              height: '40px',
              margin: '20px auto',
              animation: 'spin 2s linear infinite'
            }}
          ></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        // Display pingAmount once it's available
        <div>
          {
            (Number.parseFloat(pingAmount) / 10 >= 0 & Number.parseFloat(pingAmount) / 10 < 25) ? (
              <div>
                <h1>Confidence Score</h1>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>{Number.parseFloat(pingAmount) / 10}%</p>
              </div>
            ) : (
              (Number.parseFloat(pingAmount) / 10 >= 25 & Number.parseFloat(pingAmount) / 10 < 50) ? (
                <div>
                  <h1>Confidence Score</h1>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'orange' }}>{Number.parseFloat(pingAmount) / 10}%</p>
                </div>
              ) : (
                (Number.parseFloat(pingAmount) / 10 >= 50 & Number.parseFloat(pingAmount) / 10 < 75) ? (
                    <div>
                      <h1>Confidence Score</h1>
                      <p style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'yellow'
                      }}>{Number.parseFloat(pingAmount) / 10}%</p>
                    </div>
                  ) : (
                    (Number.parseFloat(pingAmount) / 10 >= 75 & Number.parseFloat(pingAmount) / 10 <= 100) ? (
                        <div>
                          <h1>Confidence Score</h1>
                          <p style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'green'
                          }}>{Number.parseFloat(pingAmount) / 10}%</p>
                        </div>
                      ) : (
                        <div>
                          <h1>Confidence Score</h1>
                          <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>No trust vote for this URL yet!</p>
                        </div>
                      )
                  )
              )
            )
          }
        </div>
      )}
    </div>
  );
};
