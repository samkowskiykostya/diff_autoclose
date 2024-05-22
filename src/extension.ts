import * as vscode from 'vscode';

let workingTreeTab: vscode.Tab | undefined;

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((aa) => {
            checkDiffEditorFocus();
        }),

        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('diffAutoClose.substrings')) {
                checkDiffEditorFocus();
            }
        })
    );
}

function checkDiffEditorFocus() {
    const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
    const activeTab = activeTabGroup.activeTab;

    if (activeTab && tabLabelMatchesAnySubstring(activeTab.label)) {
        // console.log('Diff editor with specific substring is focused');
        workingTreeTab = activeTab;
    } else {
        if (workingTreeTab && activeTab && !tabLabelMatchesAnySubstring(activeTab.label)) {
            // console.log('Diff editor with specific substring has lost focus');
            console.log(workingTreeTab?.label, activeTab.label);
            closeWorkingTreeTab();
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
            const tabGroup = vscode.window.tabGroups.all.find(group =>
                group.tabs.includes(workingTreeTab!)
            );
            if (tabGroup) {
                await vscode.window.tabGroups.close(workingTreeTab);
                // console.log('Closed tab with specific substring');
            }
        } catch (error) {
            console.error('Error closing tab:', error);
        }
    }
}

export function deactivate() { }
