import {
  AudioConfig,
  SpeakerAudioDestination,
  SpeechConfig,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'

let _audioPlayer: SpeakerAudioDestination | null

const { azure } = useRuntimeConfig()

function getSpeechSynthesizer() {
  if (_audioPlayer) {
    _audioPlayer.pause()
    _audioPlayer.close()
  }

  const speechConfig = SpeechConfig.fromSubscription(
    azure.subscriptionKey,
    azure.subscriptionRegion,
  )

  speechConfig.speechSynthesisLanguage = 'en-US'
  speechConfig.speechSynthesisVoiceName = 'en-US-AnaNeural'

  _audioPlayer = new SpeakerAudioDestination()
  const audioConfig = AudioConfig.fromSpeakerOutput(_audioPlayer)

  const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig)
  return speechSynthesizer
}

export function synthesizeSpeech(content: string) {
  const speechSynthesizer = getSpeechSynthesizer()

  if (speechSynthesizer) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      speechSynthesizer.speakTextAsync(
        content,
        (result) => {
          speechSynthesizer.close()

          if (result && result.audioData) {
            resolve(result.audioData)
          }
          else {
            reject(result.errorDetails)
          }
        },
        (ex) => {
          speechSynthesizer.close()
          reject(ex)
        },
      )
    })
  }
}

export function useSpeech() {
  return {
    synthesizeSpeech,
  }
}
