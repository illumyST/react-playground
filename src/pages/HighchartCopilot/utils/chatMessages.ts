export function hasMessageRole(
  message: unknown,
  role: string,
): message is {
  id?: string;
  role: string;
  content?: unknown;
} {
  return (
    typeof message === 'object' &&
    message !== null &&
    'role' in message &&
    typeof (message as { role?: unknown }).role === 'string' &&
    (message as { role: string }).role === role
  );
}

export function getMessageText(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map(getMessageText).filter(Boolean).join('');
  }

  if (typeof content === 'object' && content !== null) {
    if ('text' in content && typeof (content as { text?: unknown }).text === 'string') {
      return (content as { text: string }).text;
    }

    if ('content' in content) {
      return getMessageText((content as { content?: unknown }).content);
    }
  }

  return '';
}
