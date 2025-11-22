export function isUserSelectingText() {
    const selection = window.getSelection();
    return selection && selection.toString().length > 0;
}