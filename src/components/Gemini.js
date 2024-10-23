// src/api/gemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyDQh90MKt51z_MewUJ_4Ka2iTnZeIukIyE';
const genAI = new GoogleGenerativeAI(API_KEY); // Use .env variable for API Key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const fetchGeminiAnswer = async (disease) => {
  try {
    const prompt = `Provide list of common precautions and symptoms ${disease}, as well as information about the disease in detail. Bold titles and give spaces between.`; // Customize your prompt
    const result = await model.generateContent(prompt); // Generate content with the prompt
    return result.response.text(); // Return the generated text
  } catch (error) {
    console.error("Error fetching answer from Gemini API", error);
    throw error; // Rethrow the error for handling in the caller function
  }
};
