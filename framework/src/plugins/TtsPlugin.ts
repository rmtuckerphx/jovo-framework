// import { TtsData } from '@jovotech/common';

import { InvalidParentError, JovoResponse } from '..';
import { Extensible } from '../Extensible';
import { Jovo } from '../Jovo';
import { Platform } from '../Platform';
import { Plugin, PluginConfig } from '../Plugin';

import { Md5 } from 'ts-md5';
import { TtsCachePlugin } from './TtsCachePlugin';

export interface TtsPluginConfig extends PluginConfig {
  ttsCache?: TtsCachePlugin;
}

// Provide basic functionality that will then be used by all TTS plugins
export abstract class TtsPlugin<
  CONFIG extends TtsPluginConfig = TtsPluginConfig,
> extends Plugin<CONFIG> {
  config: any;
  abstract supportedSsmlTags: string[];
  // abstract processTts(jovo: Jovo, text: string, textType: string): Promise<TtsData | undefined>;
  abstract processTts(jovo: Jovo, text: string, textType: string): Promise<any | undefined>;
  abstract getKeyPrefix?(): string | undefined;

  mount(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.name, 'Platform');
    }

    parent.middlewareCollection.use('response.tts', (jovo: Jovo) => {
      return this.tts(jovo);
    });
  }

  protected async tts(jovo: Jovo): Promise<void> {
    const response = jovo.$response as JovoResponse;
    // if this plugin is not able to process tts, skip
    if (!this.processTts || !response) {
      return;
    }    
      if (response.getSpeech) {        
        const speech = response.getSpeech();
        const replaceList = await this.processSpeech(jovo, speech);

        if (replaceList && response.replaceSpeech) {
          response.replaceSpeech(replaceList);
        }        
      }

      if (response.getReprompt) {        
        const speech = response.getReprompt();
        const replaceList = await this.processSpeech(jovo, speech);

        if (replaceList && response.replaceReprompt) {
          response.replaceReprompt(replaceList);
        }        
      }
  }

  private async processSpeech(jovo: Jovo, speech: string | string[] | undefined): Promise<string[] | undefined> {
    const replaceList: string[] = [];

    if (speech) {
      const speechList = Array.isArray(speech) ? speech : [speech];
      for (const text of speechList) {
        const result = await this.getTtsData(jovo, text);

        if (result) {
          if (result.url) {
            replaceList.push(this.buildAudioTag(result.url));
          } else {
            replaceList.push(this.buildAudioTag(this.buildBase64Uri(result.encodedAudio, result.contentType)));
          }
          
        }
      }
    }

    if (replaceList.length > 0) {
      return replaceList;
    }

    return;
  }

  //private async processEntry(jovo: Jovo, text: string): Promise<TtsData | undefined> {
  private async getTtsData(jovo: Jovo, text: string): Promise<any | undefined> {
    const textType = 'text';
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

  private buildKey(text: string, prefix?: string): string {
    const hash = Md5.hashStr(text);
    return prefix ? `${prefix}-${hash}` : hash;
  }

  private buildAudioTag(src: string): string {
    return `<audio src="${src}"/>`;
  }

  private buildBase64Uri(data: string, mimeType: string): string {
    return `data:${mimeType};base64,${data}`;
  }
}
