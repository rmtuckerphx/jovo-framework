export class SsmlUtilities {
  static isPlainText(ssml: string): boolean {
    return !/(?:(<[^>]*[/]>)|(<[^>]*>.*?<[/][^>]*>))/g.test(ssml);
  }

  static isSupportedTag(supportedTags: string[], ssml: string): boolean {
    return supportedTags.some((tag) => {
      return new RegExp(`(?:(<${tag}[^>]*[/]>)|(<${tag}[^>]*>.*?<[/][^>]*>))`, 'g').test(ssml);
    });
  }

  static removeSSML(ssml: string, keepTags?: string[]): string {
    let noSSMLText = ssml.replace(/<speak>/g, '').replace(/<\/speak>/g, '');

    let regexPattern = '<[^>]*>';
    if (keepTags && keepTags.length > 0) {
      let exclusionPattern = '';
      keepTags.forEach((tag: string) => {
        exclusionPattern += `(?![/]?${tag})`;
      });
      regexPattern = `<${exclusionPattern}[^>]*[^>]*>`;
    }
    noSSMLText = noSSMLText.replace(new RegExp(regexPattern, 'g'), '');
    return noSSMLText;
  }

  static getTag(ssml: string): string | undefined {
    const regexp = /<\s*([^>/\s]+)/g;
    const matches = regexp.exec(ssml);
    return matches?.[1];
  }

  static getAudioSource(ssml: string): string {
    const regex = /<audio[^>]*src\s*=\s*"(.*)"/g;
    const match = regex.exec(ssml);
    return match?.[1] || '';
  }

  static getBreakTime(ssml: string): number {
    const regex = /<break[^>]*time\s*=\s*"(.*)"/g;
    const match = regex.exec(ssml);
    if (match) {
      const rawValue = match[1];
      let value = 0;
      if (rawValue.endsWith('ms')) {
        value = +rawValue.replace('ms', '');
      } else if (rawValue.endsWith('s')) {
        value = +rawValue.replace('s', '') * 1000;
      }
      return value;
    }
    return 0;
  }

  static getSSMLParts(supportedTags: string[], ssml: string): string[] {
    const regex = /(?:(<[^>]*[/]>)|(<[^>]*>.*?<[/][^>]*>))/g;
    const supportedSSMLOnly = SsmlUtilities.removeSSML(ssml, supportedTags);
    return supportedSSMLOnly.split(regex).filter((part) => {
      return part?.trim().length;
    });
  }
}
