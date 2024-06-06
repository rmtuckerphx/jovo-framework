import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConnectionPermissionScopeLike, ConsentLevelLike } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';
import { StartConnectionOutput } from './StartConnectionOutput';

export interface PermissionScopeItem {
  permissionScope: ConnectionPermissionScopeLike;
  consentLevel: ConsentLevelLike;
}

export interface ConnectionAskForPermissionConsentOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  permissionScopes: PermissionScopeItem[];
}

@Output()
export class ConnectionAskForPermissionConsentOutput extends BaseOutput<ConnectionAskForPermissionConsentOutputOptions> {
  getDefaultOptions(): ConnectionAskForPermissionConsentOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      permissionScopes: [],
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    return new StartConnectionOutput(this.jovo, {
      taskName: { name: 'AskForPermissionsConsent', amazonPredefinedTask: true },
      taskVersion: 2,

      shouldEndSession: this.options.shouldEndSession,
      onCompletion: this.options.onCompletion,
      input: {
        '@type': 'AskForPermissionsConsentRequest',
        '@version': '2',
        'permissionScopes': this.options.permissionScopes,
      },
      token: this.options.token,
    }).build();
  }
}
