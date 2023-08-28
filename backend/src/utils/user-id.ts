const HEX_OFFSET = parseInt(process.env.HEX_USER_ID_OFFSET, 16);

export function userIdToHex(userId: number): string {
  return (userId + HEX_OFFSET).toString(16);
}

export function hexToUserId(hex: string): number {
  return parseInt(hex, 16) - HEX_OFFSET;
}
