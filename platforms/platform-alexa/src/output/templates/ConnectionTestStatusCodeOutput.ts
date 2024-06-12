import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export interface ConnectionTestStatusCodeOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  code: string;
}

@Output()
export class ConnectionTestStatusCodeOutput extends BaseOutput<ConnectionTestStatusCodeOutputOptions> {
  getDefaultOptions(): ConnectionTestStatusCodeOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      code: '404',
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'TestStatusCode', amazonPredefinedTask: true },
      taskVersion: 1,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        code: this.options.code,
      },
      token: this.options.token,
    }).build();
  }
}
