// import { TtsData } from '@jovotech/common';

import { InvalidParentError } from '..';
import { Extensible } from '../Extensible';
import { Jovo } from '../Jovo';
import { Platform } from '../Platform';
import { Plugin, PluginConfig } from '../Plugin';

// import { SpeechMessage, TextMessage } from '@jovotech/output';
import { Md5 } from 'ts-md5';
import { TtsCachePlugin } from './TtsCachePlugin';
// import { JovoResponse } from '@jovotech/output';

export interface TtsPluginConfig extends PluginConfig {
  ttsCache?: TtsCachePlugin;
}

// Provide basic functionality that will then be used by all TTS plugins
export abstract class TtsPlugin<
  CONFIG extends TtsPluginConfig = TtsPluginConfig,
> extends Plugin<CONFIG> {
  // name: any;
  config: any;
  // abstract processTts(jovo: Jovo, text: string, textType: string): Promise<TtsData | undefined>;
  abstract processTts(jovo: Jovo, text: string, textType: string): Promise<any | undefined>;
  abstract getKeyPrefix?(): string | undefined;

  mount(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.name, 'Platform');
    }
    // if (this.processTts) {
    parent.middlewareCollection.use('response.tts', (jovo: Jovo) => {
      return this.tts(jovo);
    });
    // }
  }

  protected async tts(jovo: Jovo): Promise<void> {
    // const response = jovo.$response as JovoResponse;
    // if this plugin is not able to process tts, skip
    // if (!this.processTts || !response || !response.output) {
    if (!this.processTts || !jovo.$response) {
      return;
    }

    if (jovo.$response) {
      // let result: TtsData;
      let result: any;

      // const speech = response.getSpeech();

      // if (speech) {
      //   result = await this.processEntry(jovo, speech);
      //   if (result) {
      //     jovo.$response.replaceSpeech(result.url);
      //   }
      // }

      // const reprompt = response.getReprompt();

      // if (reprompt) {
      //   result = await this.processEntry(jovo, reprompt);
      //   if (result) {
      //     jovo.$response.replaceReprompt(result.url);
      //   }
      // }

      // for (const [key, value] of Object.entries((response as CoreResponse).output)) {
      //   await this.processEntry(jovo, value, value.message, 'messageAudio');
      //   await this.processEntry(jovo, value, value.reprompt, 'repromptAudio');
      // }
    }
  }

  // private async processEntry(jovo: Jovo, text: string): Promise<TtsData | undefined> {
  private async processEntry(jovo: Jovo, text: string): Promise<any | undefined> {
    // let text = '';
    const textType = 'text';

    // if (!message || !this.processTts) {
    //   return;
    // }

    // // TODO: There has to be a better way to do this
    // if (typeof message === 'string') {
    //   text = message as string;
    // }

    // if ((message as Message).text) {
    //   text = (message as Message).text || '';
    // }

    // if ((message as TextMessage).text) {
    //   text = (message as TextMessage).text || '';
    // }

    // if ((message as Message).speech) {
    //   text = (message as Message).speech || '';
    //   textType = 'ssml';
    // }

    // if ((message as SpeechMessage).speech) {
    //   text = (message as SpeechMessage).speech || '';
    //   textType = 'ssml';
    // }

    if (!text) {
      return;
    }

    let prefix;
    if (this.getKeyPrefix) {
      prefix = this.getKeyPrefix();
    }
    const audioKey = this.buildKey(text, prefix);

    let ttsResponse;

    if (this.config.ttsCache) {
      ttsResponse = this.config.ttsCache.getItem(audioKey);
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

        if (this.config.ttsCache) {
          this.config.ttsCache.storeItem(audioKey, ttsResponse);
        }

        return ttsResponse;
      }
    }

    return;
  }

  // private async processEntry(
  //   jovo: Jovo,
  //   output: any,
  //   message: MessageValue | undefined,
  //   outputKey: string,
  // ): Promise<void> {
  //   let text = '';
  //   let textType = 'text';

  //   if (!message || !this.processTts) {
  //     return;
  //   }

  //   // TODO: There has to be a better way to do this
  //   if (typeof message === 'string') {
  //     text = message as string;
  //   }

  //   if ((message as Message).text) {
  //     text = (message as Message).text || '';
  //   }

  //   if ((message as TextMessage).text) {
  //     text = (message as TextMessage).text || '';
  //   }

  //   if ((message as Message).speech) {
  //     text = (message as Message).speech || '';
  //     textType = 'ssml';
  //   }

  //   if ((message as SpeechMessage).speech) {
  //     text = (message as SpeechMessage).speech || '';
  //     textType = 'ssml';
  //   }

  //   if (!text) {
  //     return;
  //   }

  //   let prefix;
  //   if (this.getKeyPrefix) {
  //     prefix = this.getKeyPrefix();
  //   }
  //   const audioKey = this.buildKey(text, prefix);

  //   let ttsResponse;

  //   if (this.config.audioStore) {
  //     ttsResponse = this.config.audioStore.getAudioData(audioKey);
  //     if (ttsResponse) {
  //       if (!ttsResponse.key) {
  //         ttsResponse.key = audioKey;
  //       }

  //       if (!ttsResponse.text) {
  //         ttsResponse.text = text;
  //       }
  //     }
  //   }

  //   if (!ttsResponse) {
  //     ttsResponse = await this.processTts(jovo, text, textType);

  //     if (ttsResponse) {
  //       ttsResponse.key = audioKey;

  //       if (this.config.audioStore) {
  //         this.config.audioStore.storeAudioData(audioKey, ttsResponse);
  //       }

  //       // TODO: Not sure why this isn't writing to platform-specific section of $response

  //       if (output.platforms?.web) {
  //         // TODO: Would rather have audio as part of MessageValue
  //         output.platforms.web[outputKey] = ttsResponse;
  //       }
  //     }
  //   }
  // }

  private buildKey(text: string, prefix?: string) {
    const hash = Md5.hashStr(text);
    return prefix ? `${prefix}-${hash}` : hash;
  }
}
