CONTRACT_ADDRESS=erd1qqqqqqqqqqqqqpgqt5j4ury98pg4saf2ku99wkjuam38qyqqcqmqzqx3kt
URL=$(python3 test_scripts/string_to_hex.py $1)

mxpy contract query $CONTRACT_ADDRESS \
--function getRating \
--arguments $URL \
--proxy https://devnet-api.multiversx.com 
