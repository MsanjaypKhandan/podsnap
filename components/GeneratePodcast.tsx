"use client";
import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import fetch from 'node-fetch';
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {v4 as uuidv4} from 'uuid'
import { useToast } from "@/components/ui/use-toast"
import * as PlayHT from "playht"
import { useUploadFiles } from '@xixixao/uploadstuff/react';

import UnrealSpeech, {play, save } from "unrealspeech";


const useGeneratePodcast = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)

  //const getPodcastAudio = useAction(api.openai.generateAudioAction)

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  
  
   const fetchAudioData = async(url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
   }
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      })
      return setIsGenerating(false);
    }

    try {

      const url = 'https://api.v7.unrealspeech.com/speech';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'Bearer GQe7VJm4dLoFG92SPMnQ9vJYP2aSGeKpq2460uvgkZCor2FvMrFDHv'
  },
  body: JSON.stringify({
    Text: voicePrompt,
    VoiceId: voiceType,
    Bitrate: '192k',
    Speed: '0',
    Pitch: '1',
    TimestampType: 'sentence'
  })
};



  const res = await fetch(url, options)
  .then(res => res.json())
  .then(json => {
    return json;
  ///  console.log(json)
    })
  .catch(err => console.error('error:' + err));
  console.log(res);

      
      const audioData = await fetchAudioData(res.OutputUri);
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      })
    } catch (error) {
      console.log('Error generating podcast', error)
      toast({
        title: "Error creating a podcast",
        variant: 'destructive',
      })
      setIsGenerating(false);
    }
    
  }

  return { isGenerating, generatePodcast }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea 
          className="input-class font-light focus-visible:ring-offset-violet-900"
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
      <Button  className="text-16 bg-violet-900 py-4 font-bold text-white-1" onClick={generatePodcast}>
        {isGenerating ? (
          <>
            Generating
            <Loader size={20} className="animate-spin ml-2" />
          </>
        ) : (
          'Generate'
        )}
      </Button>
      </div>
      {props.audio && (
        <audio 
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast