const BUILD_STAMP = "20260314-cotomia-1";

export function withBuildStamp(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${BUILD_STAMP}`;
}
