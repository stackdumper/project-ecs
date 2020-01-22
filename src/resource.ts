/** Resource stores global data that can be used by Systems. */
export class Resource {}

/** ResourceStorage is used to store Resources. */
export class ResourceStorage extends Map<Resource['constructor'], Resource> {}
