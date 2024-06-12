import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export enum DirectLaunchDefaultPromptBehavior {
  Speak = 'SPEAK',
  Suppress = 'SUPPRESS',
}

export interface ConnectionLinkAppOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  topic: string;
  links: unknown;
  directLaunchDefaultPromptBehavior?: DirectLaunchDefaultPromptBehavior;
  sendToDeviceEnabled: boolean;
  directLaunchEnabled: boolean;
}

@Output()
export class ConnectionLinkAppOutput extends BaseOutput<ConnectionLinkAppOutputOptions> {
  getDefaultOptions(): ConnectionLinkAppOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      topic: '',
      links: {},
      sendToDeviceEnabled: true,
      directLaunchEnabled: true,
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: {
        name: 'LinkApp',
      },
      taskVersion: 2,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        links: this.options.links,
        prompt: {
          topic: this.options.topic,
          directLaunchDefaultPromptBehavior: this.options.directLaunchDefaultPromptBehavior,
        },
        directLaunch: {
          enabled: this.options.directLaunchEnabled,
        },
        sendToDevice: {
          enabled: this.options.sendToDeviceEnabled,
        },
      },
      token: this.options.token,
    }).build();
  }
}
