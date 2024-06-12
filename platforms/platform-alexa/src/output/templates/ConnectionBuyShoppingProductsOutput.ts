import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { AsinProduct } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export interface ConnectionBuyShoppingProductsOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  products: AsinProduct[];
}

@Output()
export class ConnectionBuyShoppingProductsOutput extends BaseOutput<ConnectionBuyShoppingProductsOutputOptions> {
  getDefaultOptions(): ConnectionBuyShoppingProductsOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      products: [],
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'BuyShoppingProducts', amazonPredefinedTask: true },
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
