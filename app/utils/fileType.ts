export const validFileType = (val: string | null) => {
  // test valid file extension

  if (!val?.length) {
    return { isValid: false, fileExtension: null };
  }
  const regex = /\/(png|jpeg)/;
  const isValid = regex.test(val);
  // return the file type if valid
  const stringArray = val.split("/");
  const fileExtension = stringArray[1];
  return {
    isValid: isValid,
    fileExtension,
  };
};

export const validExtension = (val: string) => {};
