import os
import uuid
import torch
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from diffusers import StableDiffusionPipeline
from dotenv import load_dotenv

load_dotenv()

class CoverService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_id = os.getenv("COVER_MODEL", "segmind/tiny-sd")
        self.pipe = None
        self.output_dir = os.path.join(os.getenv("OUTPUT_DIR", "./outputs"), "covers")
        os.makedirs(self.output_dir, exist_ok=True)

    def _load_model(self):
        if self.pipe is None:
            try:
                print(f"Loading cover generation model: {self.model_id} on {self.device}")
                self.pipe = StableDiffusionPipeline.from_pretrained(
                    self.model_id, 
                    torch_dtype=torch.float32 if self.device == "cpu" else torch.float16
                )
                self.pipe.to(self.device)
                # If on CPU, we might want to disable some features for speed
                if self.device == "cpu":
                    self.pipe.enable_attention_slicing()
            except Exception as e:
                print(f"Failed to load cover model: {e}")
                return None
        return self.pipe

    def generate_cover(self, genre, mood, title="Studio AI"):
        """
        Generate a 3000x3000px cover image based on genre and mood.
        """
        prompt = f"Professional album cover art for a {genre} song with a {mood} mood, high quality, artistic, 4k"
        
        pipe = self._load_model()
        
        if pipe:
            try:
                print(f"Generating image with prompt: {prompt}")
                # Generate at 512x512 (default for tiny-sd)
                image = pipe(prompt, num_inference_steps=20).images[0]
            except Exception as e:
                print(f"Image generation failed: {e}. Using fallback.")
                image = self._generate_fallback(genre, mood, title)
        else:
            image = self._generate_fallback(genre, mood, title)

        # Resize to 3000x3000px as requested
        print("Resizing to 3000x3000px")
        image = image.resize((3000, 3000), Image.LANCZOS)
        
        # Save
        filename = f"cover_{uuid.uuid4()}.png"
        filepath = os.path.join(self.output_dir, filename)
        image.save(filepath)
        
        return filepath

    def _generate_fallback(self, genre, mood, title):
        """
        Generate a nice gradient cover as a fallback.
        """
        print("Generating fallback gradient cover")
        # Create a gradient based on mood
        width, height = 512, 512
        image = Image.new("RGB", (width, height), "#000000")
        draw = ImageDraw.Draw(image)
        
        # Define some colors based on mood/genre
        colors = {
            "Afrobeat": ("#f7971e", "#ffd200"),
            "Amapiano": ("#302b63", "#24243e"),
            "Happy": ("#ffafbd", "#ffc3a0"),
            "Sad": ("#2c3e50", "#000000"),
            "Energetic": ("#eb3349", "#f45c43"),
            "Chill": ("#4facfe", "#00f2fe")
        }
        
        color1, color2 = colors.get(genre, colors.get(mood, ("#1a1a2e", "#16213e")))
        
        # Draw gradient
        for y in range(height):
            r = int(int(color1[1:3], 16) + (int(color2[1:3], 16) - int(color1[1:3], 16)) * y / height)
            g = int(int(color1[3:5], 16) + (int(color2[3:5], 16) - int(color1[3:5], 16)) * y / height)
            b = int(int(color1[5:7], 16) + (int(color2[5:7], 16) - int(color1[5:7], 16)) * y / height)
            draw.line((0, y, width, y), fill=(r, g, b))
            
        # Add some text
        try:
            # Try to load a font, otherwise use default
            font = ImageFont.load_default()
        except:
            font = None
            
        text = f"{title}\n{genre}\n{mood}"
        # draw.text((width/2, height/2), text, fill="white", anchor="mm") # anchor might not work with default font
        draw.text((20, 20), text, fill="white")
        
        return image

cover_service = CoverService()
