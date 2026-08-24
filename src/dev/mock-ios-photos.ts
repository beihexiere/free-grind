// Mock for @gbyte/tauri-plugin-ios-photos — DEV-only
export const PhotosAuthorizationStatus = {
	NotDetermined: 0,
	Restricted: 1,
	Denied: 2,
	Authorized: 3,
	Limited: 4,
} as const;

export const PHAssetCollectionType = {
	Album: 0,
	SmartAlbum: 1,
	Library: 2,
} as const;

export const PHAssetCollectionSubtype = {
	AlbumRegular: 0,
	AlbumSyncedEvent: 2,
	AlbumSyncedFaces: 4,
	AlbumSyncedAlbum: 1,
	AlbumImported: 100,
	AlbumMyPhotoStream: 101,
	AlbumCloudShared: 102,
	SmartAlbumGeneric: 200,
	SmartAlbumSelfPortraits: 201,
	SmartAlbumVideos: 202,
	SmartAlbumFavorites: 203,
	SmartAlbumPanoramas: 204,
	SmartAlbumRecents: 205,
	SmartAlbumScreenshots: 206,
	SmartAlbumUserLibrary: 207,
	SmartAlbumAllHidden: 208,
	SmartAlbumRecentlyAdded: 209,
	SmartAlbumYear: 210,
	SmartAlbumMonth: 211,
	SmartAlbumWeek: 212,
} as const;

export async function requestPhotosAuth(): Promise<number> {
	return PhotosAuthorizationStatus.Denied;
}

export async function getPhotosAuthStatus(): Promise<number> {
	return PhotosAuthorizationStatus.Denied;
}

export async function requestAlbums(_title: string): Promise<{ id: string } | null> {
	return null;
}

export async function createAlbum(_title: string): Promise<{ id: string }> {
	return { id: "dev-mock-album" };
}

export async function createPhotos(_albumId: string, _assets: unknown[]): Promise<string[]> {
	return [];
}

export async function createVideos(_albumId: string, _assets: unknown[]): Promise<string[]> {
	return [];
}

export async function deleteAlbumMedias(_albumId: string, _assetIds: string[]): Promise<void> {}
