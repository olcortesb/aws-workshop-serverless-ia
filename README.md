# aws-workshop-serverless-ia
AWS workshop serverless IA

# Pre-requisites

- AWS Account
- Configure AWS cli [Link](https://gist.github.com/olcortesb/a471797eb1d45c54ad51d920b78aa664)
- Install AWS Sam [Link](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

# Backend

- Deploy the backend with `aws sam`.
- The infrastructure definition is in `template.yaml` file


```bash
sam build
sam deploy
```

## Test the backen:

```bash
  curl --location 'YOUR_API_GATEWAY_ENDPOINT' \
  --header 'Content-Type: application/json' \
  --data '{
      "context": "Pinguu launching a icecream startup in the desert",
      "language": "fr"
  }'

```

# Frontend

Deploy Frontend

- Change the api gateway endpoint

- Upload zip folder to  aws Amplify

# References
- Repository build in base to WorkShop post summit: [Link](https://aws-experience.com/emea/iberia/e/e9354/post-aws-summit-madrid-workshops---serverless-track)