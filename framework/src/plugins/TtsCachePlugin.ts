// import { TtsData } from '@jovotech/common';
import { Plugin, PluginConfig } from '../Plugin';

export type TtsCachePluginConfig = PluginConfig;

export abstract class TtsCachePlugin<
  CONFIG extends TtsCachePluginConfig = TtsCachePluginConfig,
> extends Plugin<CONFIG> {
  // abstract getItem(key: string): TtsData | undefined;
  // abstract storeItem(key: string, data: TtsData): void;
  abstract getItem(key: string): any | undefined;
  abstract storeItem(key: string, data: any): void;
}
