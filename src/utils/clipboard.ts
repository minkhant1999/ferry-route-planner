import { message } from 'antd';

export function formatCoord(value: number): string {
  return value.toFixed(6);
}

function copyWithTextarea(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  return ok;
}

/** Synchronous copy — use inside click handlers before any await/setState. */
export function copyToClipboardSync(text: string, label: string): boolean {
  try {
    if (copyWithTextarea(text)) {
      message.success(`Copied ${label}`);
      return true;
    }
  } catch {
    /* fall through */
  }
  message.error('Could not copy to clipboard');
  return false;
}

export async function copyToClipboard(text: string, label: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    message.success(`Copied ${label}`);
    return true;
  } catch {
    if (copyToClipboardSync(text, label)) {
      return true;
    }
    return false;
  }
}
