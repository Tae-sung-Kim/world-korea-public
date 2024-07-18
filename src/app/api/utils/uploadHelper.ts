import { put } from '@vercel/blob';

export const FILE_PATH = {
  PRODUCT: 'product',
} as const;

export const FILE_TYPE = {
  IMAGE: 'image',
} as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
];

type UploaFilePath = (typeof FILE_PATH)[keyof typeof FILE_PATH];
type UploadFileType = (typeof FILE_TYPE)[keyof typeof FILE_TYPE];

interface IUploadOptions {
  path?: UploaFilePath;
  type: UploadFileType;
}

export async function uploadFile(files: File[], options: IUploadOptions) {
  const fileType = options.type;

  const filteredFileList = files.filter((file) => {
    if (fileType === FILE_TYPE.IMAGE) {
      return ALLOWED_IMAGE_MIME_TYPES.includes(file.type);
    }

    return false;
  });

  const list = await Promise.all(
    filteredFileList.map((file: File) => {
      let fileName = file.name;
      let pathPrefix = '';

      if (options.path) {
        pathPrefix = options.path + '/';
      }

      return put(pathPrefix + fileName, file, {
        access: 'public',
      });
    })
  );

  return list;
}
