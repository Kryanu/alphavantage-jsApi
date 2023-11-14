docker build -t my-node-api .

docker tag my-node-api kryanu/my-node-api:latest

docker push kryanu/my-node-api:latest

docker run --name finance-node-api -p 3000:3000 kryanu/my-node-api:latest 