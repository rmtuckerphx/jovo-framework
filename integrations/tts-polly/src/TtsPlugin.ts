import {
  Extensible,
  InvalidParentError,
  Jovo,
  JovoResponse,
  MessageValue,
  Platform,
  Plugin,
  PluginConfig,
} from '@jovotech/framework';

import { Message } from '@jovotech/framework';
import { SpeechMessage, TextMessage } from '@jovotech/output';
import { CoreResponse } from '@jovotech/platform-web';
import { TtsData } from './TtsData';
import { Md5 } from 'ts-md5';
import { BaseAudioStore } from './BaseAudioStore';

export interface TtsPluginConfig extends PluginConfig {
  audioStore?: BaseAudioStore;
}

// Provide basic functionality that will then be used by all TTS plugins
export abstract class TtsPlugin<
  CONFIG extends TtsPluginConfig = TtsPluginConfig,
> extends Plugin<CONFIG> {
  abstract processTts?(jovo: Jovo, text: string, textType: string): Promise<TtsData | undefined>;
  abstract getKeyPrefix?(): string | undefined;

  mount(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.name, 'Platform');
    }
    if (this.processTts) {
      parent.middlewareCollection.use('response.tts', (jovo) => {
        return this.tts(jovo);
      });
    }
  }

  protected async tts(jovo: Jovo): Promise<void> {
    const response = jovo.$response as JovoResponse;
    // if this plugin is not able to process tts, skip
    if (!this.processTts || !response || !response.output) {
      return;
    }

    for (const [key, value] of Object.entries((response as CoreResponse).output)) {
      await this.processEntry(jovo, value, value.message, 'messageAudio');
      await this.processEntry(jovo, value, value.reprompt, 'repromptAudio');
    }
  }

  private async processEntry(
    jovo: Jovo,
    output: any,
    message: MessageValue | undefined,
    outputKey: string,
  ): Promise<void> {
    let text = '';
    let textType = 'text';

    if (!message || !this.processTts) {
      return;
    }

    // TODO: There has to be a better way to do this
    if (typeof message === 'string') {
      text = message as string;
    }

    if ((message as Message).text) {
      text = (message as Message).text || '';
    }

    if ((message as TextMessage).text) {
      text = (message as TextMessage).text || '';
    }

    if ((message as Message).speech) {
      text = (message as Message).speech || '';
      textType = 'ssml';
    }

    if ((message as SpeechMessage).speech) {
      text = (message as SpeechMessage).speech || '';
      textType = 'ssml';
    }

    if (!text) {
      return;
    }

    let prefix;
    if (this.getKeyPrefix) {
      prefix = this.getKeyPrefix();
    }
    const audioKey = this.buildKey(text, prefix);

    let ttsResponse;

    if (this.config.audioStore) {
      ttsResponse = this.config.audioStore.getAudioData(audioKey);
      if (ttsResponse) {
        if (!ttsResponse.key) {
          ttsResponse.key = audioKey;
        }

        if (!ttsResponse.text) {
          ttsResponse.text = text;
        }
      }
    }

    if (!ttsResponse) {
      ttsResponse = await this.processTts(jovo, text, textType);

      if (ttsResponse) {
        ttsResponse.key = audioKey;

        if (this.config.audioStore) {
          this.config.audioStore.storeAudioData(audioKey, ttsResponse);
        }

        // TODO: Not sure why this isn't writing to platform-specific section of $response

        if (output.platforms?.web) {
          // TODO: Would rather have audio as part of MessageValue
          output.platforms.web[outputKey] = ttsResponse;
        }
      }
    }
  }

  private buildKey(text: string, prefix?: string) {
    const hash = Md5.hashStr(text);
    return prefix ? `${prefix}-${hash}` : hash;
  }
}
