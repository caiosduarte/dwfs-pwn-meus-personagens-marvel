#!/bin/bash
docker build -t meus-personagens-marvel .

docker run -d --name meus-personagens-marvel -e NODE_ENV=production -p 3000:3000 meus-personagens-marvel