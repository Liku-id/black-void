import axios from '@/lib/api/axios-client';

export const generateCompanyProfileUrl = async (fileType: string = 'pdf', imageMimeType: string = 'pdf') => {
  const { data } = await axios.get(
    `/api/ekuid/generate-company-profile-url?image_mime_type=${imageMimeType}&file_type=${fileType}`
  );
  return data;
};

export const uploadCompanyProfile = async (url: string, file: File) => {
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/pdf",
    },
    body: file,
  });
};

export const registerProjectOwner = async (payload: any) => {
  const { data } = await axios.post('/api/ekuid/register-event-organizer', payload);
  return data;
};
