import { commands, Disposable, DocumentLink, Position, TextEditorSelectionChangeKind, Uri, window } from 'vscode';
import { $config, $state, Constants } from './extension';

let onDidChangeTextEditorSelectionDisposable: Disposable | undefined;

export function registerSelectionChangeEvent(): void {
	onDidChangeTextEditorSelectionDisposable?.dispose();

	onDidChangeTextEditorSelectionDisposable = window.onDidChangeTextEditorSelection(e => {
		// Only mouse clicks
		if (e.kind !== TextEditorSelectionChangeKind.Mouse) {
			return;
		}
		// Only sinlge empty selection (single cursor)
		if (e.selections.length === 1 && !e.selections[0].isEmpty) {
			return;
		}

		tryToOpenLinkAtPosition(e.selections[0].active, e.textEditor.document.uri);
	});
}

async function tryToOpenLinkAtPosition(position: Position, uri: Uri): Promise<void> {
	const links = await commands.executeCommand<DocumentLink[]>(Constants.ExecuteLinkProviderCommandId, uri) ?? [];
	const linkUnderCursor = links.find(link => link.range.contains(position));
	if (!linkUnderCursor) {
		return;
	}
	if ($config.linkRegex !== Constants.AllDocumentLinksSymbol &&
		!$state.openLinksRegExp.test(linkUnderCursor.target!.toString(true))) {
		return;
	}

	commands.executeCommand(Constants.OpenLinkCommandId);
}
