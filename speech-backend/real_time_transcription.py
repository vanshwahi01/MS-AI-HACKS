import sys
import speech_recognition as sr

def recognize_speech_from_audio(file_path):
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(file_path) as source:
            audio = recognizer.record(source)
        transcription = recognizer.recognize_google(audio)
        print(transcription)
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        audio_file_path = sys.argv[1]
        recognize_speech_from_audio(audio_file_path)
    else:
        print("No audio file path provided.")
