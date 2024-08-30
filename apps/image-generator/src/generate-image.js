const axios = require("axios");
const fs = require("fs");

// Your Hugging Face API token
const API_TOKEN = process.env.HUGGING_FACE_API_KEY;

// The text prompt you want to generate an image for
const prompt =
  "A delicious, well-presented dish of creamy mushroom pasta made with mushrooms, garlic, cream, and parmesan cheese.";

// The Inference API URL for Stable Diffusion
const API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";

// Set up headers with the API token
const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
};

// Function to generate the image and save it to a file
async function generateAndSaveImage(prompt) {
  try {
    const response = await axios.post(
      API_URL,
      { inputs: prompt },
      { headers: headers, responseType: "arraybuffer" } // Use 'arraybuffer' to handle binary data
    );

    // Save the image as a PNG file
    const buffer = Buffer.from(response.data, "binary");
    fs.writeFileSync("generated_image.png", buffer);

    console.log("Image saved as generated_image.png");
  } catch (error) {
    console.error("Error generating image:", error.response ? error.response.data : error.message);
  }
}

// Call the function to generate and save the image
generateAndSaveImage(prompt);

// Function to generate the image
// async function generateImage(prompt) {
//   try {
//     const response = await axios.post(
//       API_URL,
//       { inputs: prompt },
//       { headers: headers }
//     );

//     // The API response includes the image in base64 format
//     const imageBase64 = response.data;

//     // Save or display the image as needed
//     console.log("Image generated:", imageBase64);
//   } catch (error) {
//     console.error("Error generating image:", error.response ? error.response.data : error.message);
//   }
// }

// // Call the function to generate the image
// generateImage(prompt);
