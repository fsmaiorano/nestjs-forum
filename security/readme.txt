openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out private_key.pem
openssl rsa -in private_key.pem -pubout -out public_key.pem

base64 -i ./private_key.pem  -o private_key-base64.txt    
base64 -i ./public_key.pem  -o public_key-base64.txt    