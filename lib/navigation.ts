const BUILD_STAMP = "20260316-mobile-ui-1";

export function withBuildStamp(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${BUILD_STAMP}`;
}
