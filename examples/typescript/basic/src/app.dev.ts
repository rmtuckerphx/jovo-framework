import { FileDb } from '@jovotech/db-filedb';
import { JovoDebugger } from '@jovotech/plugin-debugger';
import { app } from './app';
import { PollyTts } from '@jovotech/tts-polly';
import { S3TtsCache } from '@jovotech/ttscache-s3';

/*
|--------------------------------------------------------------------------
| STAGE CONFIGURATION
|--------------------------------------------------------------------------
|
| This configuration gets merged into the default app config
| Learn more here: www.jovo.tech/docs/staging
|
*/
app.use(
  new FileDb({
    pathToFile: '../db/db.json',
  }),
  new JovoDebugger({
    plugins: [
      new PollyTts({
        region: 'us-east-1',
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        cache: new S3TtsCache({
          region: 'us-east-1',
          credentials: {
            accessKeyId: '',
            secretAccessKey: '',
            },
          bucket: 'mybucket-public',
          path: 'polly-tts/audio',
          baseUrl: 'https://mybucket-public.s3.amazonaws.com',
          returnEncodedAudio: true,
        }),
      }),
    ],
  }),
);

export * from './server.express';
