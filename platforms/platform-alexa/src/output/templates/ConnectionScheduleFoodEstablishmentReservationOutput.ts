import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConnectionPostalAddress } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export interface ConnectionRestaurant {
  '@type': 'Restaurant';
  '@version': '1';
  'name': string;
  'location': ConnectionPostalAddress;
}

export interface ConnectionScheduleFoodEstablishmentReservationOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  startTime?: string;
  partySize?: number;
  restaurant: ConnectionRestaurant;
}

@Output()
export class ConnectionScheduleFoodEstablishmentReservationOutput extends BaseOutput<ConnectionScheduleFoodEstablishmentReservationOutputOptions> {
  getDefaultOptions(): ConnectionScheduleFoodEstablishmentReservationOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      restaurant: {
        '@type': 'Restaurant',
        '@version': '1',
        'name': '',
        'location': {
          '@type': 'PostalAddress',
          '@version': '1',
          'streetAddress': '',
          'locality': '',
          'region': '',
          'postalCode': '',
        },
      },
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'ScheduleFoodEstablishmentReservation', amazonPredefinedTask: true },
      taskVersion: 1,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        '@type': 'ScheduleFoodEstablishmentReservationRequest',
        '@version': '1',
        'startTime': this.options.startTime,
        'partySize': this.options.partySize,
        'restaurant': this.options.restaurant,
      },
      token: this.options.token,
    }).build();
  }
}
