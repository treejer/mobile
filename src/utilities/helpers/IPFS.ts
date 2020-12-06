interface IPFSUploadResponse {
  Hash: string;
  Name: string;
  Size: number;
}

const gatewayEndpoint = 'https://ipfs.infura.io:5001/api/v0/';
export async function upload(uri: string, type = 'image/jpg'): Promise<IPFSUploadResponse> {
  const fileNameMatch = uri.match(/[^\\\/]+$/);
  let fileName = 'file.jpg';
  if (fileNameMatch) {
    fileName = fileNameMatch[1];
  }

  const formData = new FormData();

  formData.append('file', {
    uri,
    type,
    name: fileName,
  } as any);

  const response = await fetch(`${gatewayEndpoint}/add?pin=false`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.json();
}
