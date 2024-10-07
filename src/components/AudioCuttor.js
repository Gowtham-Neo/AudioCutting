import { useEffect, useState, useRef } from "react";
import { Button, Box, Text, Input, HStack } from "@chakra-ui/react";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { BsFillSkipStartFill } from "react-icons/bs";
import { LiaRedoSolid, LiaUndoSolid } from "react-icons/lia";
import { FiScissors, FiTrash, FiPlay } from "react-icons/fi";
export default function AudioCutter({ audioFile, isActive }) {
  const [waveform, setWaveform] = useState(null);
  const [format, setFormat] = useState("mp3");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTimeMin, setStartTimeMin] = useState(0);
  const [endTimeMIn, setEndTimeMin] = useState(0);
  const [cutSegmentURL, setCutSegmentURL] = useState(null);
  const [isDropupVisible, setDropupVisible] = useState(false);
  const [initialStartTime, setInitialStartTime] = useState(0); 
  const [initialEndTime, setInitialEndTime] = useState(0);
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
        cursorColor: "#ddd5e9",
        cursorWidth: 2,

        height: 90,
        responsive: true,
        plugins: [
          regions,
          Hover.create({
            lineColor: "#fff",
            lineWidth: 2,
            labelBackground: "#555",
            labelColor: "#fff",
            labelSize: "11px",
          }),
        ],
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
          waveColor: "#4CAF50",
          progressColor: "#4CAF50",
          color: "rgba(25, 255, 255, 0.1)",
          drag: true,
          resize: true,
          handleWidth: 10,
        });
      });

      regions.on("region-updated", (region) => {
        setStartTime(region.start);
        setEndTime(region.end);
        setStartTimeMin((region.start / 60).toFixed(2));
        setEndTimeMin((region.end / 60).toFixed(2));
      });

      setEndTimeMin(audioFile.duration);
      setWaveform(wavesurfer);
      setInitialStartTime(0);
      setInitialEndTime(audioFile.duration);

      return () => {
        wavesurfer.destroy();
      };
    }
  }, [cutSegmentURL, audioFile, regions]);

  const handleCut = () => {
    if (startTime >= endTime || startTime < 0 || endTime > duration) {
      console.error("Invalid start or end time.");
      return;
    }

    setCutHistory([
      ...cutHistory,
      {
        audioURL: cutSegmentURL || URL.createObjectURL(audioFile),
        startTime,
        endTime,
      },
    ]);
    setRedoStack([]); 

    const originalAudioBlob = new Blob([audioFile], { type: audioFile.type });
    const cutSegment = originalAudioBlob.slice(
      startTime * 16250,
      endTime * 16250
    );

    const newCutSegmentURL = URL.createObjectURL(cutSegment);
    setCutSegmentURL(newCutSegmentURL);
  };

  const handleRemove = () => {
    if (startTime >= endTime || startTime < 0 || endTime > duration) {
      console.error("Invalid start or end time.");
      return;
    }
    setCutHistory([
      ...cutHistory,
      {
        audioURL: cutSegmentURL || URL.createObjectURL(audioFile),
        startTime,
        endTime,
      },
    ]);
    setRedoStack([]); 

  
    const start = startTime * 16250; 
    const end = endTime * 16250;

  
    const originalAudioBlob = new Blob([audioFile], { type: audioFile.type });

    
    const audioBeforeRemove = originalAudioBlob.slice(0, start);

  
    const audioAfterRemove = originalAudioBlob.slice(end);

    const remainingAudio = new Blob([audioBeforeRemove, audioAfterRemove], {
      type: audioFile.type,
    });

    const newAudioURL = URL.createObjectURL(remainingAudio);


    setCutSegmentURL(newAudioURL);

    setStartTime(0);
    setEndTime(remainingAudio.size / 1000); 
  };

  const handleUndo = () => {
    if (cutHistory.length === 0) return;
    setRedoStack([
      ...redoStack,
      {
        audioURL: cutSegmentURL || URL.createObjectURL(audioFile),
        startTime,
        endTime,
      },
    ]);

    
    const lastCut = cutHistory[cutHistory.length - 1];
    setCutSegmentURL(lastCut.audioURL);
    setStartTime(lastCut.startTime);
    setEndTime(lastCut.endTime);

    
    setCutHistory(cutHistory.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

 
    setCutHistory([
      ...cutHistory,
      {
        audioURL: cutSegmentURL || URL.createObjectURL(audioFile),
        startTime,
        endTime,
      },
    ]);

  
    const nextCut = redoStack[redoStack.length - 1];
    setCutSegmentURL(nextCut.audioURL);
    setStartTime(nextCut.startTime);
    setEndTime(nextCut.endTime);

 
    setRedoStack(redoStack.slice(0, -1));
  };

  const handleSave = async () => {
    if (!audioFile) {
      console.error("Original audio file is not defined");
      return;
    }

    try {
      const a = document.createElement("a");
      if (cutSegmentURL) {
        a.href = cutSegmentURL;
      } else {
        a.href = URL.createObjectURL(audioFile);
      }
      const originalFileName = audioFile.name.split(".")[0];
      const fileNameWithFormat = `${originalFileName}.${format}`;
      a.download = fileNameWithFormat;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error("Error saving audio file:", error);
    }
  };

  return (
    <Box width="100%" margin="10%" position="relative" style={
      {margin:"10%"}
    }>
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
          disabled={
            startTime === initialStartTime && endTime === initialEndTime
          }
          style={{
            border: "none",
            cursor:
              startTime === initialStartTime && endTime === initialEndTime
                ? "not-allowed"
                : "pointer",
            borderRadius: "6px",
            fontSize: "20px",
          }}
        >
          Cut
        </Button>

        <Button
          leftIcon={<FiTrash />}
          onClick={handleRemove}
          color="#B3B2B3"
          backgroundColor="#1C1D27"
          padding="10px"
          borderRadius="md"
          disabled={
            startTime === initialStartTime && endTime === initialEndTime
          }
          style={{
            border: "none",
            cursor:
              startTime === initialStartTime && endTime === initialEndTime
                ? "not-allowed"
                : "pointer",
            borderRadius: "6px",
            fontSize: "20px",
          }}
        >
          Remove
        </Button>

        <Button
          leftIcon={<LiaUndoSolid />}
          color="#B3B2B3"
          onClick={handleUndo}
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
          onClick={handleRedo}
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
        width={isActive ? "85%" : "96%"}
        position="fixed"
        bottom="0"
        marginLeft={isActive ? "-10px" : "10px"}
        borderTop="1px solid #272733"
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
          <div style={{ position: "relative" }}>
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
              onClick={() => setDropupVisible(!isDropupVisible)} 
            >
              <Text color="white">format: </Text>
              <Text color="#32CD32">{format}</Text>
            </Button>

            {/* Drop-up for format selection */}
            {isDropupVisible && (
              <div
                style={{
                  position: "absolute",
                  width: "140px",
                  bottom: "50px",
                  background: "#1F1F28",
                  borderRadius: "10px",
                  textAlign: "left",
                  padding: "15px",
                  zIndex: 1,
                  border: "1px solid #262633",
                }}
              >
                <div
                  style={{
                    color: format === "mp3" ? "#32CD32" : "white",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setFormat("mp3");
                    setDropupVisible(false); // Close drop-up after selection
                  }}
                >
                  mp3
                </div>
                <div
                  style={{
                    color: format === "wav" ? "#32CD32" : "white",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setFormat("wav");
                    setDropupVisible(false);
                  }}
                >
                  wav
                </div>
              </div>
            )}
          </div>
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
