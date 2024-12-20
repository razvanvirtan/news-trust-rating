CONTRACT_ADDRESS=erd1qqqqqqqqqqqqqpgqt5j4ury98pg4saf2ku99wkjuam38qyqqcqmqzqx3kt
URL=$(python3 test_scripts/string_to_hex.py $1)
TRUST=$2

echo $URL $TRUST

mxpy contract call $CONTRACT_ADDRESS \
    --function vote \
    --arguments $URL $TRUST \
    --pem ../../wallets/new_wallet.pem \
    --gas-limit 5000000 \
    --recall-nonce \
    --chain D \
    --proxy https://devnet-api.multiversx.com \
    --send
