from pydub import AudioSegment
import os

class MixingService:
    def mix_vocals_instrumental(self, vocal_path, instrumental_path, output_path, vocal_vol=-6.0, instrumental_vol=0.0):
        """
        Mix vocal and instrumental tracks.
        """
        print(f"Mixing: {vocal_path} + {instrumental_path} -> {output_path}")
        
        vocal = AudioSegment.from_file(vocal_path)
        instrumental = AudioSegment.from_file(instrumental_path)
        
        # Adjust volumes
        vocal = vocal + vocal_vol
        instrumental = instrumental + instrumental_vol
        
        # Ensure tracks are the same length if needed, or just overlay
        # pydub's overlay will use the length of the segment it's called on
        # If instrumental is longer, it's fine. If vocals are longer, we might want to extend instrumental.
        
        mixed = instrumental.overlay(vocal)
        
        # Export as WAV for mastering step
        mixed.export(output_path, format="wav")
        return output_path

mixing_service = MixingService()
