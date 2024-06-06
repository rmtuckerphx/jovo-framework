import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export interface ConnectionPrintWebPageOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  title: string;
  description?: string;
  url: string;
}

@Output()
export class ConnectionPrintWebPageOutput extends BaseOutput<ConnectionPrintWebPageOutputOptions> {
  getDefaultOptions(): ConnectionPrintWebPageOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      title: '',
      url: '',
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'PrintWebPage', amazonPredefinedTask: true },
      taskVersion: 1,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        '@type': 'PrintWebPageRequest',
        '@version': '1',
        'title': this.options.title,
        'description': this.options.description,
        'url': this.options.url,
      },
      token: this.options.token,
    }).build();
  }
}
