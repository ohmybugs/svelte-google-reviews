export const trim = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }

  let trimmedString = str.slice(0, maxLength);

  const lastSpaceIndex = trimmedString.lastIndexOf(' ');
  if (lastSpaceIndex !== -1) {
    trimmedString = trimmedString.slice(0, lastSpaceIndex);
  }

  trimmedString = trimmedString.replace(/[^a-zA-Z0-9]+$/, '');

  if (trimmedString.length < str.length) {
    trimmedString += '...';
  }

  return trimmedString;
};
