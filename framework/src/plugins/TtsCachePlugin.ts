// import { TtsData } from '@jovotech/common';
import { Plugin, PluginConfig } from '../Plugin';

export interface TtsCachePluginConfig extends PluginConfig {
  returnEncodedAudio: boolean;
}

export abstract class TtsCachePlugin<
  CONFIG extends TtsCachePluginConfig = TtsCachePluginConfig,
> extends Plugin<CONFIG> {
  // abstract getItem(key: string, locale: string, outputFormat: string): TtsData | undefined;
  // abstract storeItem(key: string, locale: string, data: TtsData): void;
  abstract getItem(key: string, locale: string, outputFormat: string): any | undefined;
  abstract storeItem(key: string, locale: string, data: any): void;
}
