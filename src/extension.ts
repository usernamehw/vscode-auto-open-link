import { ExtensionContext, workspace } from 'vscode';
import { registerSelectionChangeEvent } from './events';
import { ExtensionConfig } from './types';

export const enum Constants {
	SettingsPrefix = 'autoOpenLink',
	OpenLinkCommandId = 'editor.action.openLink',
	ExecuteLinkProviderCommandId = 'vscode.executeLinkProvider',
	AllDocumentLinksSymbol = '*',
}
export let $config: ExtensionConfig;
export abstract class $state {
	static openLinksRegExp: RegExp;
}

export function activate(context: ExtensionContext) {
	updateConfig();
	registerSelectionChangeEvent();

	context.subscriptions.push(workspace.onDidChangeConfiguration(e => {
		if (!e.affectsConfiguration(Constants.SettingsPrefix)) {
			return;
		}
		updateConfig();
	}));

	function updateConfig() {
		$config = workspace.getConfiguration(Constants.SettingsPrefix) as any as ExtensionConfig;
		updateOpenLinksRegexp();
	}
	function updateOpenLinksRegexp() {
		if ($config.linkRegex === Constants.AllDocumentLinksSymbol) {
			$state.openLinksRegExp = new RegExp('.*');
		} else {
			$state.openLinksRegExp = new RegExp($config.linkRegex);
		}
	}
}


export function deactivate() { }
