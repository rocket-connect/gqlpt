export function hashTypeDefs(typeDefs: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(typeDefs);

  return crypto.subtle.digest("SHA-256", data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  });
}
