export function photoToBase64(image: File): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result);
        } else {
          throw Error('error');
        }
      };
      reader.readAsDataURL(image);
    } catch (e) {
      reject(e);
    }
  });
}
