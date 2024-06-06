import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { AsinProduct } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export interface ConnectionAddToShoppingCartOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  products: AsinProduct[];
}

@Output()
export class ConnectionAddToShoppingCartOutput extends BaseOutput<ConnectionAddToShoppingCartOutputOptions> {
  getDefaultOptions(): ConnectionAddToShoppingCartOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      products: [],
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'AddToShoppingCart', amazonPredefinedTask: true },
      taskVersion: 1,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        products: this.options.products,
      },
      token: this.options.token,
    }).build();
  }
}
