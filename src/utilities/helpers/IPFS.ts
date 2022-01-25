import config from 'services/config';

interface IPFSUploadResponse {
  Hash: string;
  Name: string;
  Size: number;
}

// const gatewayEndpoint = 'https://ipfs.infura.io:5001/api/v0/add';
// const gatewayEndpoint = 'https://api.thegraph.com/ipfs/';
const gatewayEndpoint = config.ipfsPostURL;

export async function upload(uri: string, type = 'image/jpg'): Promise<IPFSUploadResponse> {
  const formData = new FormData();

  if (typeof uri === 'string') {
    const fileNameMatch = uri.match(/[^\\/]+$/);
    let fileName = 'file.jpg';
    if (fileNameMatch) {
      fileName = fileNameMatch[1];
    }

    formData.append('file', {
      uri,
      type,
      name: fileName,
    } as any);
    const response = await callUploadEndpoint(formData, true);

    return response.json();
  } else {
    formData.append('file', uri);
    const response = await callUploadEndpoint(formData, false);

    return response.json();
  }
}

export async function uploadContent(content: string): Promise<IPFSUploadResponse> {
  const formData = new FormData();

  console.log(content, 'content');

  formData.append('file', content);

  const response = await callUploadEndpoint(formData, false);

  return response.json();
}

export function getHttpDownloadUrl(hash: string) {
  // return `https://ipfs.infura.io:5001/api/v0/cat?arg=${hash}`;
  return `${config.ipfsGetURL}${hash}`;
}

function callUploadEndpoint(formData: FormData, setHeader: boolean) {
  return fetch(`${gatewayEndpoint}`, {
    method: 'POST',
    body: formData,
    headers: setHeader
      ? {
          'Content-Type': 'multipart/form-data',
        }
      : {},
  });

  // return fetch(`${gatewayEndpoint}/add?pin=false`, {
  //   method: 'POST',
  //   body: formData,
  //   headers: setHeader ? {
  //     'Content-Type': 'multipart/form-data',
  //   } : {},
  // });
}
