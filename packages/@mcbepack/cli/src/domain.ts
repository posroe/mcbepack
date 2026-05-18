export const ARCHIVE_FORMATS = ["mcpack", "mcaddon", "zip"] as const;
export const RELEASE_CHANNELS = ["stable", "beta", "preview"] as const;

export type ArchiveFormat = typeof ARCHIVE_FORMATS[number];
export type ReleaseChannel = typeof RELEASE_CHANNELS[number];
