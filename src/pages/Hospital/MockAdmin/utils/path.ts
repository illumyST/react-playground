export const pathJoin = (paths: string[], relative = false): string => {
  const final = paths
    .flatMap((segment) => segment.split('/'))
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');

  return relative ? final : `/${final}`;
};
