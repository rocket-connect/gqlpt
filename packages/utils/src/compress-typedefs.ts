export function compressTypeDefs(typeDefs: string): string {
  return typeDefs
    .replace(/[\s\t]+/g, " ") // Replace multiple whitespaces and tabs with a single space
    .replace(/"\s+/g, '"') // Remove spaces after quotes
    .replace(/\s+"/g, '"') // Remove spaces before quotes
    .replace(/\\n/g, "") // Remove newline characters
    .replace(/\s*#.*$/gm, "") // Remove comments
    .trim(); // Trim leading and trailing whitespace
}
