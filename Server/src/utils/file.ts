export const isValidBase64Image = (base64String: string): boolean => {
  const regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
  return regex.test(base64String);
};

export const getBase64FileSize = (base64String: string): number => {
    const base64Length = base64String.length - base64String.indexOf(",") - 1;
    return (base64Length * 3) / 4 / (1024 * 1024); // Convert to MB
  };
