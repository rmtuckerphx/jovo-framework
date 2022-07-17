// TODO: Import of TtsData from common not working. Fix.
// import { TtsData } from '@jovotech/common';
import { Plugin, PluginConfig } from '../Plugin';

export interface TtsCachePluginConfig extends PluginConfig {
  returnEncodedAudio: boolean;
}

export abstract class TtsCachePlugin<
  CONFIG extends TtsCachePluginConfig = TtsCachePluginConfig,
> extends Plugin<CONFIG> {
  // TODO: Import of TtsData from common not working. Fix.
  // abstract getItem(key: string, locale: string, outputFormat: string): Promise<TtsData | undefined>;
  // abstract storeItem(key: string, locale: string, data: TtsData): Promise<void>;
  abstract getItem(key: string, locale: string, outputFormat: string): Promise<any | undefined>;
  abstract storeItem(key: string, locale: string, data: any): Promise<void>;
}
