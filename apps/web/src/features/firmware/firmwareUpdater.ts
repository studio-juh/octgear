import { t } from "../../shared/i18n";

export type FirmwareArtifact = {
  readonly fileName: string;
  readonly publicPath: string;
  readonly builtAt: string;
};

type Uf2WriteData = Blob | BufferSource | string;

type Uf2WritableFileStream = {
  write(data: Uf2WriteData): Promise<void>;
  close(): Promise<void>;
};

type Uf2FileHandle = {
  createWritable(): Promise<Uf2WritableFileStream>;
};

type Uf2DirectoryHandle = {
  getFileHandle(name: string, options?: { create?: boolean }): Promise<Uf2FileHandle>;
};

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: (options?: { mode?: "read" | "readwrite" }) => Promise<Uf2DirectoryHandle>;
};

export type FirmwareInstallResult = {
  fileName: string;
  size: number;
};

export function canInstallUf2FromBrowser() {
  return typeof directoryPicker() === "function";
}

export async function downloadFirmwareUf2(artifact: FirmwareArtifact) {
  const firmware = await fetchFirmwareUf2(artifact);
  const url = URL.createObjectURL(firmware);
  const link = document.createElement("a");
  link.href = url;
  link.download = artifact.fileName;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function installFirmwareUf2(
  artifact: FirmwareArtifact,
): Promise<FirmwareInstallResult> {
  const picker = directoryPicker();

  if (!picker) {
    throw new Error(t.firmware.browserUnsupported);
  }

  const directory = await picker({ mode: "readwrite" });
  await ensureUf2BootDrive(directory);

  const firmware = await fetchFirmwareUf2(artifact);
  const target = await directory.getFileHandle(artifact.fileName, { create: true });
  const writable = await target.createWritable();
  await writable.write(firmware);
  await writable.close();

  return {
    fileName: artifact.fileName,
    size: firmware.size,
  };
}

async function fetchFirmwareUf2(artifact: FirmwareArtifact) {
  const response = await fetch(`${import.meta.env.BASE_URL}${artifact.publicPath}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(t.firmware.fetchFailed(response.status));
  }

  return response.blob();
}

async function ensureUf2BootDrive(directory: Uf2DirectoryHandle) {
  try {
    await directory.getFileHandle("INFO_UF2.TXT");
  } catch {
    throw new Error(t.firmware.selectBootDrive);
  }
}

function directoryPicker() {
  return (window as DirectoryPickerWindow).showDirectoryPicker;
}
