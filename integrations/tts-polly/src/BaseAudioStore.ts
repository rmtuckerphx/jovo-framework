import { Plugin, PluginConfig } from '@jovotech/framework';
import { TtsData } from './TtsData';

export type AudioStoreConfig = PluginConfig;

export abstract class BaseAudioStore<
  CONFIG extends AudioStoreConfig = AudioStoreConfig,
> extends Plugin<CONFIG> {
  abstract getAudioData(key: string): TtsData | undefined;
  abstract storeAudioData(key: string, data: TtsData): void;
}
