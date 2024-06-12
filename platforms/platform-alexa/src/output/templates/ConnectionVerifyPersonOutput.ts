import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export enum PolicyName {
  VoicePin = 'VOICE_PIN',
}

export interface ConnectionVerifyPersonOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  level: number;
  policyName: PolicyName;
}

@Output()
export class ConnectionVerifyPersonOutput extends BaseOutput<ConnectionVerifyPersonOutputOptions> {
  getDefaultOptions(): ConnectionVerifyPersonOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      level: 400,
      policyName: PolicyName.VoicePin,
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'VerifyPerson', amazonPredefinedTask: true },
      taskVersion: 2,
      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        requestedAuthenticationConfidenceLevel: {
          level: this.options.level,
          customPolicy: {
            policyName: this.options.policyName,
          },
        },
      },
      token: this.options.token,
    }).build();
  }
}
