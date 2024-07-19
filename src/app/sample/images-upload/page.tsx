'use client';

import { HTTP_METHODS } from '@/constants/http.constant';
import http from '@/services';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
  const [images, setImages] = useState<Array<File | undefined | null>>([]);
  const [name, setName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);

    images.forEach((d) => {
      if (d instanceof File && d.size > 0) {
        formData.append('images', d);
      }
    });

    http
      .post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response: any) => {
        console.log(response.data);
      });
  };

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <input
          type="file"
          onChange={(e) =>
            setImages((prevState) => {
              return [e.target.files?.item(0), prevState[1], prevState[2]];
            })
          }
        />
        <input
          type="file"
          onChange={(e) =>
            setImages((prevState) => {
              return [prevState[0], e.target.files?.item(0), prevState[2]];
            })
          }
        />
        <input
          type="file"
          onChange={(e) =>
            setImages((prevState) => {
              return [prevState[0], prevState[1], e.target.files?.item(0)];
            })
          }
        />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}
