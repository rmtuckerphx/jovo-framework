import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export interface ConnectionPrintPdfOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  title: string;
  description?: string;
  url: string;
}

@Output()
export class ConnectionPrintPdfOutput extends BaseOutput<ConnectionPrintPdfOutputOptions> {
  getDefaultOptions(): ConnectionPrintPdfOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      title: '',
      url: '',
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'PrintPDF', amazonPredefinedTask: true },
      taskVersion: 1,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        '@type': 'PrintPDFRequest',
        '@version': '1',
        'title': this.options.title,
        'description': this.options.description,
        'url': this.options.url,
      },
      token: this.options.token,
    }).build();
  }
}
