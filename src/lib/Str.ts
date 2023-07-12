export const group = (str: string) => {
  const parts: string[][] = [[]];

  const lines = str.split("\n");

  for (const line of lines) {
    if (!line.trim().length) {
      parts.push([]);
    } else {
      parts[parts.length - 1].push(line);
    }
  }

  return parts.filter((x) => x.length > 0);
};
