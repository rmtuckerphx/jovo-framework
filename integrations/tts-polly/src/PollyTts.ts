import {
  PollyClient,
  SynthesizeSpeechCommand,
  SynthesizeSpeechCommandInput,
} from '@aws-sdk/client-polly';
import type { Credentials } from '@aws-sdk/types';

// TODO: Import of TtsData from common not working. Fix.
// import { TtsData } from '@jovotech/common';

import { Readable } from 'stream';
import { TtsPluginConfig, DeepPartial, TtsPlugin, Jovo, AudioUtilities } from '@jovotech/framework';

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
      fallbackLocale: 'en-US',
    };
  }

  getKeyPrefix(): string | undefined {
    return `polly-${this.config.voiceId.toLowerCase()}`;
  }

  // TODO: Import of TtsData from common not working. Fix.
  // async processTts(jovo: Jovo, text: string, textType: string): Promise<TtsData | undefined> {
  async processTts(jovo: Jovo, text: string, textType: string): Promise<any | undefined> {
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

    try {
      const response = await this.client.send(command);
      if (!response.AudioStream) {
        return;
      }

      const result: any = {
        contentType: response.ContentType,
        text,
        fileExtension: this.config.outputFormat,
        encodedAudio: await AudioUtilities.getBase64Audio(response.AudioStream as Readable),
      };
      return result;
    } catch (error) {
      console.log((error as Error).message);
    }
    return;
  }
}
