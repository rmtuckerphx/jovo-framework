import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConnectionPostalAddress } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export interface ConnectionScheduleTaxiReservationOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  partySize?: number;
  pickupLocation?: ConnectionPostalAddress;
  pickupTime?: string;
  dropoffLocation?: ConnectionPostalAddress;
}

@Output()
export class ConnectionScheduleTaxiReservationOutput extends BaseOutput<ConnectionScheduleTaxiReservationOutputOptions> {
  getDefaultOptions(): ConnectionScheduleTaxiReservationOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'ScheduleTaxiReservation', amazonPredefinedTask: true },
      taskVersion: 1,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        '@type': 'ScheduleTaxiReservationRequest',
        '@version': '1',
        'partySize': this.options.partySize,
        'pickupLocation': this.options.pickupLocation,
        'pickupTime': this.options.pickupTime,
        'dropoffLocation': this.options.dropoffLocation,
      },
      token: this.options.token,
    }).build();
  }
}
