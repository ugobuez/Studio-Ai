import os
import pedalboard
from pedalboard import Pedalboard, Compressor, Gain, HighpassFilter, Limiter, Reverb, Chorus
import numpy as np
import soundfile as sf
import librosa
try:
    import pyloudnorm as pyln
    PYLOUDNORM_AVAILABLE = True
except ImportError:
    PYLOUDNORM_AVAILABLE = False

class MasteringService:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate

    def master_audio(self, input_path, output_path, target_lufs=-14.0):
        """
        Apply professional mastering to an audio file.
        Pipeline: High-pass -> Compressor -> Chorus (for widening) -> Reverb (light) -> Limiter -> LUFS Normalization
        """
        print(f"Mastering audio: {input_path} -> {output_path}")
        
        # Load audio
        audio, sr = librosa.load(input_path, sr=self.sample_rate, mono=False)
        
        # Ensure it's stereo (2, N) for processing
        if audio.ndim == 1:
            audio = np.stack([audio, audio])
        
        # Create pedalboard
        board = Pedalboard([
            HighpassFilter(cutoff_frequency_hz=40),
            Compressor(threshold_db=-12, ratio=2.5, attack_ms=10, release_ms=100),
            # Subtle Chorus for stereo widening effect
            Chorus(rate_hz=0.5, depth=0.1, centre_delay_ms=7.0, feedback=0.0, mix=0.1),
            # Light reverb for glue
            Reverb(room_size=0.1, dry_level=0.9, wet_level=0.05),
            Limiter(threshold_db=-0.1)
        ])
        
        # Process audio with pedalboard
        mastered = board(audio, sr)
        
        # LUFS normalization
        if PYLOUDNORM_AVAILABLE:
            try:
                # pyloudnorm expects (N, C)
                data = mastered.T
                meter = pyln.Meter(sr) # create BS.1770 meter
                loudness = meter.integrated_loudness(data)
                
                # normalize to target LUFS
                mastered_normalized = pyln.normalize.loudness(data, loudness, target_lufs)
                
                # Check for clipping after normalization and apply a safety limiter if needed
                peak = np.max(np.abs(mastered_normalized))
                if peak > 1.0:
                    mastered_normalized = mastered_normalized / (peak + 0.01)
                
                # Back to mastered variable
                mastered = mastered_normalized.T
            except Exception as e:
                print(f"LUFS normalization failed: {e}. Falling back to peak normalization.")
                mastered = self._peak_normalize(mastered)
        else:
            print("pyloudnorm not available. Using peak normalization.")
            mastered = self._peak_normalize(mastered)
            
        # Save output (soundfile expects (N, C))
        sf.write(output_path, mastered.T, sr)
        
        return output_path

    def _peak_normalize(self, audio):
        peak = np.max(np.abs(audio))
        if peak > 0:
            return audio * (10**(-0.1/20) / peak)
        return audio

mastering_service = MasteringService()
