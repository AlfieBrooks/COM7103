import axios from "axios";

const models = [
  "CompVis/stable-diffusion-v1-4",
  "stabilityai/stable-diffusion-xl-base-1.0",
  "black-forest-labs/FLUX.1-dev"
]

export async function generateImage({ title, ingredients }: { title: string; ingredients: string[] }): Promise<Buffer> {
  try {
    const API_URL = `https://api-inference.huggingface.co/models/${models[1]}`;
    const prompt = `A delicious, well-presented dish of ${title} made with ${ingredients.join(', ')}`;
    const response = await axios.post(
      API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`
        },
        responseType: 'arraybuffer'
      }
    );

    const buffer = Buffer.from(response.data, 'base64');
    return buffer;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429 || error.response?.status === 503) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`API request failed: ${error.message}`);
    }
    throw error;
  }
}