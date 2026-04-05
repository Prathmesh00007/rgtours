/**
 * Upload an image via the backend (Cloudinary). Sends session cookie.
 * @param {File} file
 * @param {{ folder: 'packages' | 'profile-photos', onProgress?: (n: number) => void }} options
 * @returns {Promise<string>} secure URL
 */
export function uploadImageWithProgress(file, { folder = "packages", onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://rgtours.onrender.com/api/upload/image");
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.min(100, Math.floor((e.loaded / e.total) * 100)));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300 && data.success && data.url) {
          resolve(data.url);
        } else {
          reject(new Error(data.message || "Upload failed"));
        }
      } catch {
        reject(new Error("Invalid server response"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}
