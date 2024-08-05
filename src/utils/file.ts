/**
 * 주어진 파일을 Blob으로 변환하고, 선택적으로 핸들러 함수를 호출합니다.
 * 핸들러 함수가 제공되지 않으면 변환된 파일과 Blob URL을 반환합니다.
 *
 * @param {File} param.file - 변환할 파일 객체입니다.
 * @param {Function} [param.handler] - (선택적) 변환된 파일과 Blob URL을 처리할 핸들러 함수입니다.
 *                            핸들러 함수는 `{ file: File; blob: string }` 객체를 인자로 받아 처리합니다.
 * @returns {{ file: File; blob: string } | void} - 핸들러 함수가 제공된 경우 `void`를 반환하며, 핸들러 함수가 제공되지 않은 경우 `{ file, blob }` 객체를 반환합니다.
 */

export const fileToBlob = ({
  file,
  handler,
}: {
  file: File;
  handler?: Function;
}): { file: File; blob: string } | void => {
  if (file) {
    const blobFile = new Blob([file], { type: file.type });
    const blob = URL.createObjectURL(blobFile);

    if (handler) {
      (async (file, blob) => {
        await handler({ file, blob });
      })(file, blob);
    } else {
      return { file, blob };
    }
  } else {
    console.error('file이 존재하지 않습니다.');
  }
};

/**
 * 바이트를 메가바이트로 변환합니다.
 *
 * @param {number} bytes - 변환할 바이트 값입니다.
 * @returns {number} 변환된 메가바이트 값입니다. 소수점 두 자리까지 반올림됩니다.
 */
export const bytesToMB = (bytes: number): number => {
  // 1 메가바이트는 1,048,576 바이트입니다.
  const MEGABYTE = 1024 * 1024;

  // 바이트를 메가바이트로 변환하고 소수점 두 자리까지 반올림합니다.
  return parseFloat((bytes / MEGABYTE).toFixed(2));
};
