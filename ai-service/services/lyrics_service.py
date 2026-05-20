import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class LyricsService:
    def __init__(self):
        self.api_key = os.getenv("FIREWORKS_API_KEY")
        self.base_url = "https://api.fireworks.ai/inference/v1"
        self.model = "accounts/fireworks/models/llama-v3p1-70b-instruct"
        
        if not self.api_key:
            print("Warning: FIREWORKS_API_KEY not found in environment variables.")
        
        self.client = OpenAI(
            base_url=self.base_url,
            api_key=self.api_key
        ) if self.api_key else None

    def generate_lyrics(self, prompt, genre, mood):
        """
        Generate song lyrics using Fireworks AI.
        """
        if not self.client:
            return "Lyrics generation is currently unavailable (API key missing)."

        system_prompt = (
            "You are a professional songwriter specializing in global music genres like Afrobeat, Amapiano, and Afropop. "
            "Your task is to generate high-quality song lyrics based on the user's prompt, genre, and mood. "
            "The lyrics should have a clear structure (e.g., Verse 1, Chorus, Verse 2, Chorus, Bridge, Outro). "
            "For Afrobeat/Amapiano, focus on catchy hooks, rhythmic flow, and cultural vibes suitable for global distribution. "
            "Respond ONLY with the song title and the structured lyrics."
        )

        user_message = (
            f"Genre: {genre}\n"
            f"Mood: {mood}\n"
            f"Prompt: {prompt}\n\n"
            "Please generate a complete set of lyrics for this song."
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=1000,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Fireworks AI API: {str(e)}")
            return f"Error generating lyrics: {str(e)}"

lyrics_service = LyricsService()
