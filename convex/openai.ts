import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams['voice'],
      input,
    });

    const buffer = await mp3.arrayBuffer();
    
    return buffer;
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    const url = response.data[0].url;

    if(!url) {
      throw new Error('Err generating thumbnail');
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  }
})

export const generateImageAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    // Prepare the request body
    const requestBody = JSON.stringify({
      "key" : process.env.OPENAI_API_KEY,
     "negative_prompt": "bad quality",
    "width": "512",
    "height": "512",
    "safety_checker": false,
    "seed": null,
    "samples":1,
    "base64":false,
    "webhook": null,
    "track_id": null
    });

    // Make the request to the external API
    const response = await fetch('https://modelslab.com/api/v6/realtime/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    // Parse the response data
    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    // Parse the response data
    const data = await response.json();

    // Extract the output URL
    const url = data.output[0];

    if(!url) {
      throw new Error('Err generating thumbnail');
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  }
});