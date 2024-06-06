import { JovoCliError, MAGNIFYING_GLASS, PluginCommand, Task, flags } from '@jovotech/cli-core';
import * as smapi from '../smapi';
import { AlexaCli } from '..';
import { PublicationMethodLike, PublicationMethod } from '../interfaces';

export class CertifyCommand extends PluginCommand {
  $plugin!: AlexaCli;
  static id = 'certify:alexa';
  static description = 'This submits an alexa skill to certification';
  static examples: string[] = ['jovo certify:alexa'];
  static flags = {
    ...PluginCommand.flags,
    'skill-id': flags.string({ char: 's', description: 'Alexa Skill ID' }),
    'ask-profile': flags.string({
      description: 'Name of used ASK profile',
    }),
    'publication-method': flags.string({
      options: Object.values(PublicationMethod),
      default: PublicationMethod.MANUAL_PUBLISHING,
    }),
  };
  static args = [];

  async run(): Promise<void> {
    const { flags } = this.parse(CertifyCommand);
    const skillId = flags['skill-id'] || this.$plugin.config.skillId;
    const askProfile = flags['ask-profile'] || this.$plugin.config.askProfile || 'default';
    const publicationMethod: PublicationMethodLike = flags['publication-method'];

    const certifyTask: Task = new Task(
      `${MAGNIFYING_GLASS} Submitting Alexa Skill ${skillId} to Certification`,
      async () => {
        if (!skillId)
          throw new JovoCliError({
            message: 'Cannot submit Skill to Certification without skillId',
            hint: 'Either add a skillId to the stage in the project configuration or add the --skill-id flag',
          });

        return smapi.submitSkillForCertification(skillId, publicationMethod, askProfile);
      },
    );
    await certifyTask.run();
  }
}
