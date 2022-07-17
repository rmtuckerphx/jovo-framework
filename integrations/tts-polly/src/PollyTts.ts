import {
  PollyClient,
  SynthesizeSpeechCommand,
  SynthesizeSpeechCommandInput,
} from '@aws-sdk/client-polly';
import type { Credentials } from '@aws-sdk/types';

// import { TtsData } from '@jovotech/common';

import { Readable } from 'stream';
import * as streams from 'memory-streams';
import { TtsPluginConfig, DeepPartial, TtsPlugin, Jovo, TtsData } from '@jovotech/framework';

export interface PollyTtsConfig extends TtsPluginConfig {
  credentials: Credentials;
  region: string;
  lexiconNames?: string[];
  outputFormat: string;
  voiceId: string;
  sampleRate: string;
  languageCode?: string;
  speechMarkTypes?: string[];
  engine: string;
}

export type PollyTtsInitConfig = DeepPartial<PollyTtsConfig> &
  Pick<PollyTtsConfig, 'credentials' | 'region'>;

export class PollyTts extends TtsPlugin<PollyTtsConfig> {
  readonly client: PollyClient;
  supportedSsmlTags: string[] = [
    'break',
    'emphasis',
    'lang',
    'mark',
    'p',
    'phoneme',
    'prosody',
    's',
    'say-as',
    'speak',
    'sub',
    'w',
    'amazon:breath',
    'amazon:domain',
    'amazon:effect',
  ];

  constructor(config: PollyTtsInitConfig) {
    super(config);

    this.client = new PollyClient({
      credentials: this.config.credentials,
      region: this.config.region,
    });
  }

  getDefaultConfig(): PollyTtsConfig {
    return {
      region: '',
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      outputFormat: 'mp3',
      voiceId: 'Matthew',
      sampleRate: '16000',
      engine: 'standard',
    };
  }

  getKeyPrefix(): string | undefined {
    return `polly-${this.config.voiceId.toLowerCase()}`;
  }

  async processTts(jovo: Jovo, text: string, textType: string): Promise<TtsData | undefined> {
    const params: SynthesizeSpeechCommandInput = {
      Text: text,
      TextType: textType,
      OutputFormat: this.config.outputFormat,
      VoiceId: this.config.voiceId,
      SampleRate: this.config.sampleRate,
      LanguageCode: this.config.languageCode,
      SpeechMarkTypes: this.config.speechMarkTypes,
      Engine: this.config.engine,
      LexiconNames: this.config.lexiconNames,
    };

    const command = new SynthesizeSpeechCommand(params);
    const response = await this.client.send(command);
    if (!response.AudioStream) {
      return;
    }

    if (response.AudioStream instanceof Readable) {
      return new Promise((resolve, reject) => {
        const reader = response.AudioStream as Readable;
        const writer = new streams.WritableStream();
        reader.pipe(writer);
        reader.on('end', () => {
          const buff = writer.toBuffer();
          const value = buff.toString('base64');
          resolve({
            contentType: response.ContentType,
            encodedAudio: value,
            text,
          });
        });

        reader.on('error', (e) => {
          reject(e);
        });
      });
    }

    return;
  }
}
