import { IsInstance, IsOptional, Type, ValidateNested } from '..';
import { NormalizedOutputTemplatePlatforms } from './NormalizedOutputTemplatePlatforms';
import { OutputTemplateBase } from './OutputTemplateBase';
import { ResponseItem } from '../../../framework/src/ResponseItem';

export class NormalizedOutputTemplate extends OutputTemplateBase implements ResponseItem {
  static getKeys(): Array<keyof NormalizedOutputTemplate> {
    return ['message', 'reprompt', 'listen', 'quickReplies', 'card', 'carousel', 'platforms'];
  }

  @IsOptional()
  @IsInstance(NormalizedOutputTemplatePlatforms)
  @ValidateNested()
  @ValidateNested({ each: true })
  @Type(() => NormalizedOutputTemplatePlatforms)
  platforms?: NormalizedOutputTemplatePlatforms;

  getSpeech?(): string {
    return typeof this.message === 'string' ? this.message : this.message?.speech || this.message?.text || '';
  }

  setSpeech?(value: string) {
    if (typeof this.message === 'string') {
      this.message = {
        speech: this.message,
        text: this.message,
      };
    }

    this.message!.speech = value;
    
    if (this.message?.text) {
      this.message.text = removeSSML(this.message.text);
    }
  }
}

// function isPlainText(value: string):boolean {
//   return true;
// }

function removeSSML(ssml: string):string {
  return '';
}