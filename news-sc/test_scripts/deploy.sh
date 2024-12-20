mxpy --verbose contract deploy \
 --bytecode output/news-sc.wasm \
 --pem ../../wallets/new_wallet.pem \
 --recall-nonce \
 --gas-limit 60000000 \
 --chain D \
 --proxy https://devnet-api.multiversx.com \
 --outfile deploy-devnet.interaction.json \
 --send
