export function photoToBase64(image: File): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        if (reader.result) {
          console.log(reader.result);
          resolve(reader.result);
        } else {
          throw Error('error');
        }
      };
    } catch (e) {
      reject(e);
    }
  });
}
