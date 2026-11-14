import messages from '../../messages/en.json';

type MessageValue = string | number;
type MessageParameters = Record<string, MessageValue>;

export function getTranslator(namespace: string) {
  return (key: string, parameters?: MessageParameters): string => {
    const message = [...namespace.split('.'), ...key.split('.')]
      .reduce<unknown>((value, part) => {
        if (value && typeof value === 'object' && part in value) {
          return (value as Record<string, unknown>)[part];
        }
        return undefined;
      }, messages);

    if (typeof message !== 'string') {
      console.error(`Missing translation: ${namespace}.${key}`);
      return key;
    }

    return message.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
      const value = parameters?.[name];
      return value === undefined ? placeholder : String(value);
    });
  };
}
