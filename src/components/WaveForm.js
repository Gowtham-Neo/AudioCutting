
import React, { useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

export default function Waveform({ audioUrl }) {
  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#ddd",
      progressColor: "#ff0000",
    });

    wavesurfer.load(audioUrl);

    return () => wavesurfer.destroy();
  }, [audioUrl]);

  return <div id="waveform" />;
}
