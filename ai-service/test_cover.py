import os
import sys
from dotenv import load_dotenv

# Add the current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from services.cover_service import cover_service

def test_generate_cover():
    print("Testing cover generation...")
    try:
        # Test with a specific genre and mood
        result = cover_service.generate_cover(
            genre="Afrobeat",
            mood="Energetic",
            title="Summer Vibes"
        )
        print(f"Cover generated successfully: {result}")
        if os.path.exists(result["cover_path"]):
            print(f"File exists at {result['cover_path']}")
            print(f"File size: {os.path.getsize(result['cover_path'])} bytes")
        else:
            print("ERROR: File does not exist!")
    except Exception as e:
        print(f"Error during cover generation: {str(e)}")

if __name__ == "__main__":
    test_generate_cover()
