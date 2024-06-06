import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export enum ImageType {
  Jpg = 'JPG',
  Jpeg = 'JPEG',
}

export interface ConnectionPrintImageOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  title: string;
  description?: string;
  url: string;
  imageType: ImageType;
}

@Output()
export class ConnectionPrintImageOutput extends BaseOutput<ConnectionPrintImageOutputOptions> {
  getDefaultOptions(): ConnectionPrintImageOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      title: '',
      url: '',
      imageType: ImageType.Jpg,
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'PrintImage', amazonPredefinedTask: true },
      taskVersion: 1,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        '@type': 'PrintImageRequest',
        '@version': '1',
        'title': this.options.title,
        'description': this.options.description,
        'url': this.options.url,
        'imageType': this.options.imageType,
      },
      token: this.options.token,
    }).build();
  }
}
