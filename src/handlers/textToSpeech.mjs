
/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  SPDX-License-Identifier: MIT-0

  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from 'crypto'

export const handler = async (event) => {

  // Making the call to Polly to convert our story to speech (mp3 file)   
  const pollyInput = {
    Engine: "neural",
    OutputFormat: 'mp3',
    Text: event.story,
    VoiceId: getVoiceId(event.language),
  }
  const pollyClient = new PollyClient()
  const pollyCommand = new SynthesizeSpeechCommand(pollyInput)
  const pollyResponse = await pollyClient.send(pollyCommand)
  
  // Uploading the mp3 file on our S3 bucket
  const mp3FileName = `${randomUUID()}.mp3`

  const s3UploadInput = {
    Body: pollyResponse.AudioStream,
    Bucket: process.env.MVPSTORIESBUCKET_BUCKET_NAME,
    Key: mp3FileName,
    ContentType: 'audio/mpeg'
  }
  const s3Client = new S3Client()
  const s3Upload = new Upload({
    client: s3Client,
    params: s3UploadInput,
  })
  await s3Upload.done()

  // Generating a presigned URL for our uploaded file
  const signedUrlExpiresIn = 60 * 5
  const s3GetObjectInput = { Bucket: process.env.MVPSTORIESBUCKET_BUCKET_NAME, Key: mp3FileName }
  const s3GetObjectCommand = new GetObjectCommand(s3GetObjectInput)
  const mp3Url = await getSignedUrl(s3Client, s3GetObjectCommand, { expiresIn: signedUrlExpiresIn })
  
  // Returning the url to our mp3 file
  return { mp3Url }
}


// Function that returns the adequate voice depending on the language
const getVoiceId = language => {
  if (language == 'fr') return "Lea"
  if (language == 'nl') return "Laura"
  if (language == 'ar') return "Hala"
  if (language == 'it') return "Bianca"
  if (language == 'es') return "Lucia"
  return "Joanna"
}
