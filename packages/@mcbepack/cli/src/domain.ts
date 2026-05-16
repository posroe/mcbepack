export const archiveFormats = ["mcpack", "mcaddon", "zip"] as const;
export const releaseChannels = ["stable", "beta", "preview"] as const;

export type ArchiveFormat = typeof archiveFormats[number];
export type ReleaseChannel = typeof releaseChannels[number];
