import * as vscode from 'vscode';

let workingTreeTab: vscode.Tab | undefined;
const doNotCloseTabs = new Set<string>();

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((aa) => {
            checkDiffEditorFocus();
        }),

        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('diffAutoClose.substrings')) {
                checkDiffEditorFocus();
            }
        }),

        vscode.commands.registerCommand('diffAutoClose.toggleDoNotClose', async (tab?: vscode.Tab) => {
            if (!tab) {
                tab = vscode.window.tabGroups.activeTabGroup.activeTab;
            }
            if (!tab) {
                return;
            }

            const tabId = getTabId(tab);
            if (doNotCloseTabs.has(tabId)) {
                doNotCloseTabs.delete(tabId);
                vscode.window.showInformationMessage(`Auto-close enabled for "${tab.label}"`);
            } else {
                doNotCloseTabs.add(tabId);
                vscode.window.showInformationMessage(`Auto-close disabled for "${tab.label}"`);
            }
        })
    );
}

function getTabId(tab: vscode.Tab): string {
    return `${tab.group.viewColumn}_${tab.label}`;
}

function checkDiffEditorFocus() {
    const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
    const activeTab = activeTabGroup.activeTab;

    if (activeTab && tabLabelMatchesAnySubstring(activeTab.label)) {
        workingTreeTab = activeTab;
    } else {
        if (workingTreeTab && activeTab && !tabLabelMatchesAnySubstring(activeTab.label)) {
            const tabId = getTabId(workingTreeTab);
            if (!doNotCloseTabs.has(tabId)) {
                closeWorkingTreeTab();
            }
            workingTreeTab = undefined;
        }
    }
}

function tabLabelMatchesAnySubstring(label: string): boolean {
    const substrings = getConfiguredSubstrings();
    return substrings.some(substring => label.includes(substring));
}

function getConfiguredSubstrings(): string[] {
    const config = vscode.workspace.getConfiguration('diffAutoClose');
    const substrings = config.get<string>('substrings', '');
    return substrings.split(',').map(substring => substring.trim());
}

async function closeWorkingTreeTab() {
    if (workingTreeTab) {
        try {
            for (const tabGroup of vscode.window.tabGroups.all) {
                const tabToClose = tabGroup.tabs.find(tab => tab.label === workingTreeTab!.label);
                if (tabToClose) {
                    await vscode.window.tabGroups.close(tabToClose);
                    break; // Exit the loop once the tab is closed
                }
            }
        } catch (error) {
            console.error('Error closing tab:', error);
        }
    }
}

export function deactivate() { }
