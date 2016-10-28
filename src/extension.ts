import * as vscode from 'vscode';

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
	public _onDidChange = new vscode.EventEmitter<vscode.Uri>();

	public provideTextDocumentContent(uri: vscode.Uri): string {
		return `
			<body>
				<iframe
					width="100%"
					height="100%"
					frameborder="0"
					src="http://localhost:8080"
					style="
						position: absolute;
						left: 0;
						right: 0;
						bottom: 0;
						top: 0;
					" />
			</body>
		`;
	}

	public get onDidChange(): vscode.Event<vscode.Uri> {
		return this._onDidChange.event;
	}

	public update(uri: vscode.Uri) {
		this._onDidChange.fire(uri);
	}
}

export function activate(context: vscode.ExtensionContext) {
	const previewUri = vscode.Uri.parse('css-preview://authority/css-preview');
	let provider = new TextDocumentContentProvider();
	let registration = vscode.workspace.registerTextDocumentContentProvider('css-preview', provider);
	provider.update(previewUri);
	let disposable = vscode.commands.registerCommand('extension.openWebBrowser', () => {
		return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'Web Browser').then((success) => {
			// do nothing
		}, (reason) => {
			vscode.window.showErrorMessage(reason);
		});
	});
	context.subscriptions.push(disposable, registration);
}

export function deactivate() {
}