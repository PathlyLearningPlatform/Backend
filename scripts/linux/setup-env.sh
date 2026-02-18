#!/bin/bash

microservices=(
  "./infra/auth" 
  "./infra/auth/db" 
  "./infra/reverse-proxy" 
  "./services/api-gateway" 
  "./services/learning-paths" 
  "./services/learning-paths/db"
  "./services/progress"
  "./services/progress/db"
)

for key in "${!microservices[@]}"
do
  touch "${microservices[key]}/.env"
  cat "${microservices[key]}/.env.example" > "${microservices[key]}/.env"
done