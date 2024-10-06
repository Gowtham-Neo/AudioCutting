import { useEffect, useState, useRef } from "react";
import { Button, Box, Text, Input, HStack } from "@chakra-ui/react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { BsFillSkipStartFill } from "react-icons/bs";
import { LiaRedoSolid, LiaUndoSolid } from "react-icons/lia";
import { FiScissors, FiTrash, FiPlay } from "react-icons/fi";

export default function AudioCutter({ audioFile, onRemove }) {
  const [waveform, setWaveform] = useState(null);


  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTimeMin, setStartTimeMin] = useState(0);
  const [endTimeMIn, setEndTimeMin] = useState(0);
  const [cutSegmentURL, setCutSegmentURL] = useState(null);

  const waveformRef = useRef(null);

  const [redoStack, setRedoStack] = useState([]);
  const [cutHistory, setCutHistory] = useState([]);

  const regions = RegionsPlugin.create();

useEffect(() => {
  if (audioFile && waveformRef.current) {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#4CAF50",
      progressColor: "#4CAF50",
      height: 100,
      responsive: true,
      plugins: [regions],
    });

    const loadAudio = (audioURL) => {
      wavesurfer.load(audioURL);
    };

    if (cutSegmentURL) {
      loadAudio(cutSegmentURL);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        loadAudio(event.target.result);
      };
      reader.readAsDataURL(audioFile);
    }

    wavesurfer.on("decode", () => {
      setDuration(wavesurfer.getDuration());
      regions.addRegion({
        start: 0,
        end: wavesurfer.getDuration(),
        color: "rgba(25, 255, 255, 0.5)",
        backgroundColor: "green",
        drag: false,
        resize: true,
      });
    });

    regions.on("region-updated", (region) => {
      setStartTime(region.start);
      setEndTime(region.end);
      setStartTimeMin((region.start/60).toFixed(2));
      setEndTimeMin((region.end/60).toFixed(2));
    });

    setWaveform(wavesurfer);

    return () => {
      wavesurfer.destroy();
    };
  }
}, [cutSegmentURL, audioFile]);


const handleCut = () => {
  if (startTime >= endTime || startTime < 0 || endTime > duration) {
    console.error("Invalid start or end time.");
    return;
  }


  const originalAudioBlob = new Blob([audioFile], { type: audioFile.type });
  const cutSegment = originalAudioBlob.slice(startTime * 17500, endTime * 17500 );

 
  const newCutSegmentURL = URL.createObjectURL(cutSegment);
  setCutSegmentURL(newCutSegmentURL);
};

  const handleSave = async () => {
    if (!audioFile) {
      console.error("Original audio file is not defined");
      return;
    }

    try {

      const a = document.createElement("a");
      if (cutSegmentURL){
        a.href = cutSegmentURL;
      }else{
        a.href = URL.createObjectURL(audioFile);
      }
      a.download = audioFile.name;
      document.body.appendChild(a);
      a.click(); 
      document.body.removeChild(a); 
      URL.revokeObjectURL(url); 
    } catch (error) {
      console.error("Error saving audio file:", error);
    }
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

      <HStack
        spacing="8"
        marginBottom="20px"
        justifyContent="flex-end"
        padding="20px"
      >
        <Button
          leftIcon={<FiScissors />}
          onClick={handleCut}
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
          onClick={onRemove}
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
              cursor: "pointer",
            }}
          >
            <FiPlay size="20px" />
          </Button>
          <BsFillSkipStartFill
            onClick={() => waveform && waveform.seekTo(0)}
            backgroundColor="transparent"
            color="#FFF"
            fontSize="20px"
            cursor="pointer"
          />
        </HStack>

        <HStack spacing="4">
          <HStack>
            <Text color="#FFF">Start:</Text>
            <Input
              value={startTimeMin}
              onChange={(e) => setStartTimeMin(e.target.value)}
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
              value={endTimeMIn}
              onChange={(e) => setEndTimeMin(e.target.value)}
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
              cursor: "pointer",
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
              cursor: "pointer",
            }}
          >
            Save
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
