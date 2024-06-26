export const BACKEND_URI = 'https://dghq5z6zfvye5vk-api.blackwave-e0d1d49b.eastus.azurecontainerapps.io';

export const RetrievalMode = {
  Hybrid: "hybrid",
  Vectors: "vectors",
  Text: "text"
};

export const GPT4VInput = {
  TextAndImages: "textAndImages",
  Images: "images",
  Texts: "texts"
};

export const VectorFieldOptions = {
  Embedding: "embedding",
  ImageEmbedding: "imageEmbedding",
  Both: "both"
};

export function getHeaders() {
  return {
    "Content-Type": "application/json"
  };
}

export async function chatApi(request) {
  const body = JSON.stringify(request);
  return await fetch(`${BACKEND_URI}/ai`, {
    method: "POST",
    mode: "cors",
    headers: getHeaders(),
    body: body
  });
}

export function getCitationFilePath(citation) {
  return `${BACKEND_URI}/content/${citation}`;
}
