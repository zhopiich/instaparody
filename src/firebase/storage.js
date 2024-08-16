// import { ref as refVue } from "vue";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/firebase";

// export const progress = refVue(0);

export const uploadFile = async (file, path = "images/") => {
  if (!file) return;

  const { name, type } = file;

  const getUUID = () => window.crypto.randomUUID();
  const randomName = getUUID() + "_" + name;

  const storageRef = ref(storage, path + randomName);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: type,
  });

  let url;

  const uploadAndGetUrl = () => {
    return new Promise((resolve) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // progress.value =
          // (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            url = downloadURL;
            resolve();
          });
        }
      );
    });
  };

  await uploadAndGetUrl();

  return url;
};

export const deleteFile = async (fileURL) => {
  if (!fileURL) return;

  const fileRef = ref(storage, fileURL);

  try {
    return await deleteObject(fileRef);
  } catch (error) {
    console.log(error);
  }
};
