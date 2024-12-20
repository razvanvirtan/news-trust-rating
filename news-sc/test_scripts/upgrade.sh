CONTRACT_ADDRESS=erd1qqqqqqqqqqqqqpgqt5j4ury98pg4saf2ku99wkjuam38qyqqcqmqzqx3kt

mxpy --verbose contract upgrade $CONTRACT_ADDRESS  \
 --bytecode output/news-sc.wasm \
 --pem ../../wallets/new_wallet.pem \
 --recall-nonce \
 --gas-limit 60000000 \
 --chain D \
 --proxy https://devnet-api.multiversx.com \
 --outfile deploy-devnet.interaction.json \
 --send
