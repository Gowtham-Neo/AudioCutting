import { useState, useRef } from "react";
import { Container, Title, Button, Space, Group, Text } from "@mantine/core";
import { AiOutlineClose } from "react-icons/ai";
import { IconLock } from "@tabler/icons-react";
import AudioCutter from "./AudioCuttor";

export default function AudioUploader({isActive}) {
  const [audioFile, setAudioFile] = useState(null);
  const [showCutter, setShowCutter] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setShowCutter(true);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleCloseCutter = () => {
    setShowCutter(false);
    setAudioFile(true)
  };
  const handleCloseCutter2 = () => {
    setShowCutter(false);
    setAudioFile(false)
  };

  return (
    <div>
      <Container
        style={{
          backgroundColor: "#16161E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          marginLeft: isActive ? "10%" : "0",
          transition: "margin-left 0.5s ease",
        }}
      >
        {showCutter ? (
          <>
            <Title
              order={1}
              style={{
                color: "#cccccc",
                fontSize: "15px",
                marginBottom: "32px",
                position: "absolute",
                right: "70px",
                top: "200px",
                fontStyle: "italic",
              }}
            >
              {audioFile?.name}
            </Title>
            <AiOutlineClose
              onClick={handleCloseCutter}
              style={{
                position: "absolute",
                right: "65px",
                top: "60px",
                color: "white",
                fontSize: "34px",
                cursor: "pointer",
              }}
            />

            <AudioCutter
              audioFile={audioFile}
              isActive={isActive}
              onClose={handleCloseCutter}
              onRemove={() => setAudioFile(null)}
            />
          </>
        ) : (
          <>
            {audioFile ? (
              <>
                <Title
                  order={1}
                  style={{
                    color: "#cccccc",
                    fontSize: "35px",
                    marginBottom: "20px",
                  }}
                >
                  Are you sure you want to finish editing?
                </Title>
                <Title
                  order={1}
                  style={{
                    color: "#cccccc",
                    fontSize: "25px",
                    marginBottom: "20px",
                  }}
                >
                  Any associated audio track settings will be deleted along with
                  it.{" "}
                </Title>

                <div
                  style={{
                    color: "#cccccc",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: "30px",
                    width: "30%",
                    marginBottom: "16px",
                  }}
                >
                  <Button
                    onClick={handleCloseCutter2}
                    style={{
                      borderRadius: "20px",
                      border: "none",
                      color: "white",
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontSize: "17px",
                      backgroundColor: "#BB4047",
                    }}
                  >
                    Yes, Delete
                  </Button>{" "}
                  <Button
                    onClick={handleCloseCutter}
                    style={{
                      color: "white",
                      cursor: "pointer",
                      fontSize: "17px",
                      backgroundColor: "#16161E",
                      border: "none",
                    }}
                  >
                    Cancel
                  </Button>{" "}
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    color: "#cccccc",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: "30px",
                    width: "30%",
                    marginBottom: "16px",
                  }}
                >
                  <Title order={3}>How it Works</Title>
                  <Title order={3}>Joiner</Title>
                </div>
                <Space h="md" />

                <Title
                  order={1}
                  style={{
                    color: "#cccccc",
                    fontSize: "50px",
                    marginBottom: "16px",
                  }}
                >
                  Audio Cutter
                </Title>
                <Title
                  order={3}
                  style={{
                    color: "#cccccc",
                    fontSize: "30px",
                    marginBottom: "32px",
                  }}
                >
                  Free editor to trim and cut any audio file online
                </Title>

                <input
                  type="file"
                  id="file-upload"
                  accept="audio/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />

                <Button
                  onClick={handleBrowseClick}
                  style={{
                    borderRadius: "20px",
                    border: "2px solid #6A5ACD",
                    color: "white",
                    padding: "10px 20px",
                    cursor: "pointer",
                    fontSize: "17px",
                    backgroundColor: "#16161E",
                  }}
                >
                  Browse my file
                </Button>
              </>
            )}
          </>
        )}
      </Container>

      <Space h="xl" />
      <hr />

      {!showCutter && !audioFile && (
        <Container
          style={{
            backgroundColor: "#16161E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "left",
          }}
        >
          <Title
            order={1}
            style={{
              color: "#ffffff",
              marginBottom: "30px",
              width: "80%",
              fontSize: "30px",
            }}
          >
            How to cut audio
          </Title>
          <div
            style={{
              borderLeft: "2px solid #675CC3",
              paddingLeft: "16px",
              marginBottom: "32px",
              backgroundColor: "#1C1C26",
              width: "80%",
              fontSize: "25px",
            }}
          >
            <Text
              style={{
                color: "#cccccc",
                marginBottom: "32px",
                marginTop: "16px",
              }}
            >
              This app can be used to trim and/or cut audio tracks, remove audio
              fragments.
            </Text>
            <Text style={{ color: "#cccccc", marginBottom: "16px" }}>
              You can save the audio file in any format (codec parameters are
              configured).
            </Text>
            <Text style={{ color: "#cccccc", marginBottom: "40px" }}>
              It works directly in the browser, no need to install any software.
            </Text>
          </div>

          <Group
            position="left"
            style={{
              color: "#cccccc",
              marginTop: "16px",
              marginBottom: "16px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              width: "80%",
            }}
          >
            <IconLock style={{ marginRight: "8px", marginBottom: "30px" }} />
            <Text
              size="lg"
              style={{ fontWeight: "bold", width: "80%", fontSize: "30px" }}
            >
              Privacy and Security Guaranteed
            </Text>
          </Group>
          <div
            style={{
              borderLeft: "2px solid #675CC3",
              paddingLeft: "16px",
              backgroundColor: "#1C1C26",
              width: "80%",
            }}
          >
            <Text
              style={{
                color: "#cccccc",
                marginBottom: "16px",
                marginTop: "16px",
                fontSize: "25px",
              }}
            >
              This is a serverless app. Your files do not leave your device.
            </Text>
          </div>
        </Container>
      )}
    </div>
  );
}
