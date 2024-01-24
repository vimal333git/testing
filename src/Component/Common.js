import atob from 'atob';

export const base64_decode = (base64String) => {
    const decodedData = atob(base64String);
    return decodedData;
}