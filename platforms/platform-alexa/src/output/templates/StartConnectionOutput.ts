import { Output, BaseOutput, OutputTemplate, OutputOptions, Jovo } from '@jovotech/framework';
import { DeepPartial, JovoError } from '@jovotech/common';
import { OnCompletion } from '../models/common/OnCompletion';

interface DirectSkillConnectionOutputOptions extends OutputOptions {
  /**
   * The taskName consists of a prefix (either 'AMAZON' or the providerSkillId) and the actual name of the task.
   * e. g. 'AMAZON.PrintPDF' or 'amzn1.ask.skill.12345678-90ab-cdef-1234-567890abcdef.CountDown'
   * For managed skill connection (no providerSkillId passed), only Amazon predefined tasks will work.
   */
  taskName: {
    /**
     * If true, 'AMAZON' will be used as a taskName prefix. If false, providerSkillId will be used as taskName prefix.
     * Default value is true
     */
    amazonPredefinedTask?: boolean;
    name: string;
  };
  taskVersion?: number;
  shouldEndSession?: boolean;
  onCompletion: OnCompletion;
  input: any;
  token?: string;
  /**
   * This needs to be provided to make this a direct skill connection
   */
  providerSkillId?: string;
}

@Output()
export class StartConnectionOutput extends BaseOutput<DirectSkillConnectionOutputOptions> {
  constructor(jovo: Jovo, options: DeepPartial<DirectSkillConnectionOutputOptions> | undefined) {
    super(jovo, options);
  }

  getDefaultOptions(): DirectSkillConnectionOutputOptions {
    return {
      taskVersion: 1,
      taskName: { amazonPredefinedTask: true, name: '' },
      input: {},
      onCompletion: OnCompletion.ResumeSession,
    };
  }

  build(): OutputTemplate {
    if (!this.options.taskName.amazonPredefinedTask && !this.options.providerSkillId) {
      throw new JovoError({
        message: 'for direct skill connection, providerSkillId must be provided',
        hint: 'to link to a task in a specific skill, provide providerSkillId, to use managed skill connection, set taskName.amazonPredefinedTask to true',
        learnMore:
          'https://developer.amazon.com/en-US/docs/alexa/custom-skills/use-skill-connections-to-request-tasks.html#for-direct-skill-connection-1',
      });
    }

    const shouldEndSession =
      this.options.onCompletion === OnCompletion.SendErrorsOnly
        ? true
        : this.options.shouldEndSession;

    const taskPrefix = this.options.taskName.amazonPredefinedTask
      ? 'AMAZON'
      : this.options.providerSkillId;

    return {
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession,
              directives: [
                {
                  type: 'Connections.StartConnection',
                  uri: `connection://${taskPrefix}.${this.options.taskName.name}/${
                    this.options.taskVersion
                  }${
                    this.options.providerSkillId ? `?provider=${this.options.providerSkillId}` : ''
                  }`,
                  input: this.options.input,
                  onCompletion: this.options.onCompletion,
                  token: this.options.token,
                },
              ],
            },
          },
        },
      },
    };
  }
}
