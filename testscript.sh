sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
sudo docker exec $(sudo docker ps -aqf 'name=billing-service_web_1') nyc npm test

