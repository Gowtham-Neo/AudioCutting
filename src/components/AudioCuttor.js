import { useEffect, useState, useRef } from "react";
import {
  Button,
  Box,
  Text,
  Input,
  HStack,
  IconButton,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import WaveSurfer from "wavesurfer.js";
import { BsFillSkipStartFill } from "react-icons/bs";
import RegionsPlugin from "wavesurfer.js/plugins/regions";
import { LiaRedoSolid, LiaUndoSolid } from "react-icons/lia";
import { FiScissors, FiTrash, FiPlay } from "react-icons/fi";

export default function AudioCutter({ audioFile, onRemove }) {
  const [waveform, setWaveform] = useState(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [region, setRegion] = useState(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [redoStack, setRedoStack] = useState([]);
  const [cutHistory, setCutHistory] = useState([]);
  useEffect(() => {
    if (audioFile && waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4CAF50",
        progressColor: "#4CAF50",
        height: 100,
        responsive: true,
        plugins: [
          RegionsPlugin.create({
            regions: [
              {
                start: 0,
                end: 5,
                color: "#FEFFFE",
                drag: true,
                resize: true,
              },
            ],
          }),
        ],
      });

      wavesurferRef.current = wavesurfer;

      const reader = new FileReader();
      reader.onload = (event) => {
        wavesurfer.load(event.target.result);
      };
      reader.readAsDataURL(audioFile);

      wavesurfer.on("ready", () => {
        const totalDuration = wavesurfer.getDuration();
        setDuration(totalDuration);
        setEndTime(totalDuration);
      });

      wavesurfer.on("region-created", (newRegion) => {
        setRegion(newRegion);
        setStartTime(newRegion.start);
        setEndTime(newRegion.end);
      });

      wavesurfer.on("region-update-end", (updatedRegion) => {
        setStartTime(updatedRegion.start);
        setEndTime(updatedRegion.end);
      });

      setWaveform(wavesurfer);

      return () => {
        wavesurfer.destroy();
      };
    }
  }, [audioFile]);

  const handleSliderChange = (value) => {
    const [start, end] = value;
    if (region) {
      region.update({ start, end });
    }
    setStartTime(start);
    setEndTime(end);
  };

  // const handleCut = () => {
  //   if (!waveform || !waveform.backend) return;
  //   const audioBuffer = waveform.backend.getAudioBuffer();
  //   if (!audioBuffer) return;

  //   const startSample = Math.floor(startTime * audioBuffer.sampleRate);
  //   const endSample = Math.floor(endTime * audioBuffer.sampleRate);

  //   const cutSegment = audioBuffer
  //     .getChannelData(0)
  //     .slice(startSample, endSample);

  //   const newAudioBuffer = new AudioBuffer({
  //     length: cutSegment.length,
  //     sampleRate: audioBuffer.sampleRate,
  //   });
  //   newAudioBuffer.copyToChannel(cutSegment, 0);

  //   waveform.loadAudioData(newAudioBuffer);

  //   setCutHistory((prevHistory) => [
  //     ...prevHistory,
  //     { start: startTime, end: endTime, segment: cutSegment },
  //   ]);
  //   setRedoStack([]);

  //   const cutBlob = new Blob([cutSegment], { type: "audio/wav" });
  //   const url = URL.createObjectURL(cutBlob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "cut_segment.wav";
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };
  // const handleRemove = () => {
  //   if (!region) return;
  //   const removeSegment = {
  //     start: region.start,
  //     end: region.end,
  //   };

  //   waveform.clearRegions();

  //   const totalDuration = waveform.getDuration();
  //   const remainingRegions = [];

  //   if (removeSegment.start > 0) {
  //     remainingRegions.push({
  //       start: 0,
  //       end: removeSegment.start,
  //       color: "#FEFFFE",
  //     });
  //   }
  //   if (removeSegment.end < totalDuration) {
  //     remainingRegions.push({
  //       start: removeSegment.end,
  //       end: totalDuration,
  //       color: "#FEFFFE",
  //     });
  //   }

  //   remainingRegions.forEach((region) => waveform.addRegion(region));

  //   setStartTime(0);
  //   setEndTime(totalDuration);
  // };

  const handleSave = async () => {
    if (!waveform) {
      console.error("Waveform instance is not defined");
      return;
    }

    const audioData = waveform;
    if (!audioData) {
      console.error("No audio data available");
      return;
    }

    const blob = new Blob([audioData], { type: "audio/mp3" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "audio.mp3";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="90%" margin="auto" position="relative">
      <div
        ref={waveformRef}
        style={{
          width: "95%",
          margin: "auto",
          marginBottom: "16px",
          position: "relative",
        }}
      ></div>

      <RangeSlider
        aria-label={["start", "end"]}
        value={[startTime, endTime]}
        onChange={handleSliderChange}
        min={0}
        max={duration}
        step={0.1}
        style={{ marginBottom: "20px", border: "2px solid #FFF" }}
        orientation="horizontal"
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack bg="#4CAF50" />
        </RangeSliderTrack>

        <RangeSliderThumb
          index={0}
          boxSize={6}
          bg="transparent"
          zIndex="99"
          border="none"
          _before={{
            content: '""',
            position: "absolute",
            height: "150px",
            width: "10px",
            backgroundColor: "#6AE0C4",
            top: "-150px",
            transform: "translateX(-50%)",
          }}
        />
        <RangeSliderThumb
          index={1}
          boxSize={6}
          bg="transparent"
          border="none"
          zIndex="99"
          _before={{
            content: '""',
            position: "absolute",
            height: "150px",
            width: "10px",
            backgroundColor: "#6AE0C4",
            top: "-150px",
            transform: "translateX(-50%)",
          }}
        />
      </RangeSlider>

      <HStack
        spacing="8"
        marginBottom="20px"
        justifyContent="flex-end"
        padding="20px"
      >
        <Button
          leftIcon={<FiScissors />}
          // onClick={handleCut}
          color="#B3B2B3"
          backgroundColor="#1C1D27"
          padding="10px"
          cursor="pointer"
          style={{
            border: "none",
            borderRadius: "6px",
            fontSize: "20px",
          }}
        >
          Cut
        </Button>

        <Button
          leftIcon={<FiTrash />}
          // onClick={handleRemove}
          color="#B3B2B3"
          backgroundColor="#1C1D27"
          padding="10px"
          borderRadius="md"
          cursor="pointer"
          style={{
            border: "none",
            borderRadius: "6px",
            fontSize: "20px",
          }}
        >
          Remove
        </Button>

        <Button
          leftIcon={<LiaUndoSolid />}
          // onClick={handleUndo}
          color="#B3B2B3"
          backgroundColor="#1C1D27"
          padding="10px"
          borderRadius="lg"
          cursor={cutHistory.length === 0 ? "not-allowed" : "pointer"}
          style={{
            border: "none",
            borderRadius: "6px",
            fontSize: "20px",
          }}
          isDisabled={cutHistory.length === 0}
        ></Button>

        <Button
          leftIcon={<LiaRedoSolid />}
          // onClick={handleRedo}
          color="#B3B2B3"
          backgroundColor="#1C1D27"
          padding="10px"
          borderRadius="lg"
          cursor={redoStack.length === 0 ? "not-allowed" : "pointer"}
          style={{
            border: "none",
            borderRadius: "6px",
            fontSize: "20px",
          }}
          isDisabled={redoStack.length === 0}
        ></Button>
      </HStack>

      <Text>
        Time: {startTime}s - {endTime}s
      </Text>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        padding="10px"
        backgroundColor="#16161E"
        borderRadius="4px"
        width="85%"
        position="fixed"
        bottom="0"
        marginLeft="-10px"
      >
        <HStack spacing="20">
          <Button
            onClick={() => waveform && waveform.playPause()}
            borderRadius="full"
            bg="#2A2A40"
            color="#FFF"
            width="120px"
            height="45px"
            _hover={{ bg: "#33334A" }}
            style={{
              border: "none",
              borderRadius: "30px",
              fontSize: "20px",
            }}
          >
            <FiPlay size="20px" />
          </Button>
          <BsFillSkipStartFill
            onClick={() => waveform && waveform.seekTo(0)}
            backgroundColor="transparent"
            color="#FFF"
            fontSize="20px"
          />
        </HStack>

        <HStack spacing="4">
          <HStack>
            <Text color="#FFF">Start:</Text>
            <Input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              type="number"
              width="120px"
              height="40px"
              bg="#16161E"
              color="white"
              border="1px solid #262633"
              style={{
                borderRadius: "30px",
                fontSize: "14px",
              }}
              textAlign="center"
              _focus={{ borderColor: "#32CD32", boxShadow: "none" }}
            />
          </HStack>
          <HStack>
            <Text color="#FFF">End:</Text>
            <Input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              type="number"
              width="120px"
              height="40px"
              color="white"
              bg="#16161E"
              border="1px solid #262633"
              style={{
                borderRadius: "30px",
                fontSize: "14px",
              }}
              textAlign="center"
              _focus={{ borderColor: "#32CD32", boxShadow: "none" }}
            />
          </HStack>
        </HStack>

        <HStack>
          <Button
            width="140px"
            height="40px"
            color="white"
            bg="#16161E"
            border="1px solid #262633"
            style={{
              borderRadius: "30px",
              fontSize: "18px",
            }}
          >
            <Text color="white">format: </Text>
            <Text color="#32CD32">mp3</Text>
          </Button>

          <Button
            backgroundColor="#E0E0E5"
            color="#000"
            _hover={{ bg: "#CDCDCD" }}
            onClick={() => handleSave()}
            width="140px"
            height="40px"
            style={{
              borderRadius: "30px",
              fontSize: "18px",
            }}
          >
            Save
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
