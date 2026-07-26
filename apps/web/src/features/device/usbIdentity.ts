export type UsbIdentity = {
  readonly vendorId: number;
  readonly productId: number;
  readonly manufacturerName: string;
  readonly productName: string;
};

export function formatUsbId(value: number) {
  return `0x${value.toString(16).padStart(4, "0").toUpperCase()}`;
}
