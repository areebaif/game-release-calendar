export const validFileType = (val: string | undefined) => {
  // test valid file extension

  if (!val?.length) {
    return { isValid: false };
  }
  const regex = /image\/(png|jpeg)/;
  const isValid = regex.test(val);
  // return the file type if valid
  return {
    isValid: isValid,
  };
};
