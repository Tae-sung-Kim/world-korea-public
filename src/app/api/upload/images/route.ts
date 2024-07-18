import { FILE_PATH, FILE_TYPE, uploadFile } from '../../utils/uploadHelper';
import { NextRequest, NextResponse } from 'next/server';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: NextRequest) {
  // const body = await req.json();

  try {
    const formData = await req.formData();
    console.log(formData.get('name'));
    console.log(formData.get('images'));
    console.log(formData.getAll('images'));

    const imageFiles = Array.from(formData.getAll('images')) as File[];

    const list = await uploadFile(imageFiles, {
      path: FILE_PATH.PRODUCT,
      type: FILE_TYPE.IMAGE,
    });
    /*
      {
        contentType: 'image/png',
        downloadUrl: '...',
        pathname: '...',
        url: '...'
      }
    */

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
