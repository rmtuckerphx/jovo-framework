import {
  JovoCliError,
  Log,
  MAGNIFYING_GLASS,
  PluginCommand,
  Task,
  flags,
} from '@jovotech/cli-core';
import * as smapi from '../smapi';
import { AlexaCli } from '..';

export class ValidateCommand extends PluginCommand {
  $plugin!: AlexaCli;
  static id = 'validate:alexa';
  static description = 'This submits a skill validation';
  static examples: string[] = ['jovo validate:alexa'];
  static flags = {
    'skill-stage': flags.string({
      description: 'Alexa Skill Stage',
      options: ['development', 'live', 'certification'],
      default: 'development',
    }),
    'skill-id': flags.string({ char: 's', description: 'Alexa Skill ID' }),
    'ask-profile': flags.string({
      description: 'Name of used ASK profile',
    }),
    'locales': flags.string({ multiple: true, char: 'l' }),
    ...PluginCommand.flags,
  };
  static args = [];

  async run(): Promise<void> {
    const { flags } = this.parse(ValidateCommand);
    const skillId = flags['skill-id'] || this.$plugin.config.skillId;
    const askProfile = flags['ask-profile'] || this.$plugin.config.askProfile || 'default';
    const locales =
      flags.locales ||
      Object.values(this.$plugin.config.locales || {}).reduce(
        (prev, curr) => [...prev, ...curr],
        [],
      );

    const validateTask: Task = new Task(
      `${MAGNIFYING_GLASS} Submitting Alexa Skill ${skillId} to Validation`,
      async () => {
        if (!skillId)
          throw new JovoCliError({
            message: 'Cannot submit Skill Validation without skillId',
            hint: 'Either add a skillId to the stage in the project configuration or add the --skill-id flag',
          });

        const validationResponse = await smapi.submitSkillValidation(
          skillId,
          locales,
          flags['skill-stage'],
          askProfile,
        );
        return `Started Validation with id ${validationResponse.id}`;
      },
    );
    await validateTask.run();
  }
}
