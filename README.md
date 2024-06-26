# aws-workshop-serverless-ia
AWS workshop serverless IA: Build your serverless GenAI powered MVP with AWS

![image](docs/0.png)


# Pre-requisites

- AWS Account
- Configure AWS cli [Link](https://gist.github.com/olcortesb/a471797eb1d45c54ad51d920b78aa664)
- Install AWS Sam [Link](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

- ⚠️ Request access to the model `jurasic-2Mid` in a region of preference

![image](docs/4.png)

- ⚠️ Change the default region in this file(`samconfig.toml`) , the same region than requested access to `jurassic-2 Mid`

```yml
version = 0.1
[default.deploy.parameters]
stack_name = "mvp-stories-demo"
resolve_s3 = true
s3_prefix = "mvp-stories-demo"
region = "us-west-2" # Your region
confirm_changeset = true 
capabilities = "CAPABILITY_IAM"
image_repositories = []

```

# Architecture

![image](docs/3.png)

1. The user will connect with the frontend that is deployed on AWS Amplify Hosting
2. After providing story context with selected language, the frontend will submit an HTTP request to our Amazon API Gateway backend
3. The request is proxied and will trigger a syncrounous execution of an AWS Step Functions workflow
4. The first step in the workflow is to generate a unique story by invoking a Large Language Model (LLM) through Amazon Bedrock
5. If the requested language for the story is not english, Amazon Translate will be used to translate the story
6. An AWS Lambda function is invoked and will convert the generated (and eventually translated story) to speech
7. The generated mp3 will be uploaded on Amazon S3
8. A presigned URL  will be returned to the frontend in order for the end-user to play the generated mp3


# Backend

- Deploy the backend with `aws sam`.
- The infrastructure definition is in `template.yaml` file

> Add Spanish language 

```js
// Function that returns the adequate voice depending on the language
// File src/handlers/textToSpeech.mjs
const getVoiceId = language => {
  if (language == 'fr') return "Lea"
  if (language == 'nl') return "Laura"
  if (language == 'ar') return "Hala"
  if (language == 'it') return "Bianca"
  if (language == 'es') return "Lucia"
  return "Joanna"
}
```

### Deploy the backend

```bash
sam build
sam deploy
```

## Test the backend:

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

```js
fetch('YOUR_API_GATEWAY_ENDPOINT', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
})
```
- Upload zip folder to  aws Amplify

- Access to url enable by amplify for test the app in different languages

> Add Spanish language support

```html
<div>
    <input type="radio" name="language" value="en" checked> English
    <input type="radio" name="language" value="fr"> French
    <input type="radio" name="language" value="ar"> Arabic
    <input type="radio" name="language" value="nl"> Dutch
    <input type="radio" name="language" value="es"> Spanish
</div>
```

### The web will look like this

![image](docs/1.png)


# Delete Stack

1. Remove files from S3 bucket
2. Run `sam destroy`

# References
- Repository build in base to WorkShop post summit: [Link](https://aws-experience.com/emea/iberia/e/e9354/post-aws-summit-madrid-workshops---serverless-track)