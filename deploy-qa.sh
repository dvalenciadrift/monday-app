#!/bin/bash
APP_NAME=$(grep 'app_name:' ./atmos/config/atmos/environments/qa.yml)
NAME=${APP_NAME:10}

zip -r $NAME.zip . -x "/atmos/*" "/.git/*" "/.env"
echo "Zip complete"
echo "Sending $NAME.zip to AWS S3 bucket"
aws s3 cp $NAME.zip s3://pse-lambda-code-qa/$NAME.zip --profile qa
echo "Zip pushed to AWS S3 bucket"
echo "Running atmos -e qa apply"
cd atmos
atmos -e qa apply
echo "Connecting Lambda to $NAME.zip"
RESULT=$(aws lambda update-function-code --function-name pse-$NAME-lambda-qa --profile qa --region us-east-1 --s3-bucket pse-lambda-code-qa --s3-key $NAME.zip)
echo "Lambda code updated"
cd ..
rm $NAME.zip
