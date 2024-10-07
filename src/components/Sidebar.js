import { useState, useEffect } from "react";
import { ScrollArea, Text, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import indian from "../images/image.png";
import { MdOutlineContactSupport, MdRemoveRedEye } from "react-icons/md";
import {
  GiSplitArrows,
  GiTunePitch,
  GiMarsPathfinder,
  GiBoltCutter,
  GiJoin,
} from "react-icons/gi";
import { FaMicrophoneLines, FaRecordVinyl } from "react-icons/fa6";
import { BiMenuAltLeft } from "react-icons/bi";

export default function Sidebar() {
  const [opened, setOpened] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);


    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getSidebarWidth = () => {
    if (screenWidth < 768) {
      return opened ? "100px" : "0"; 
    } else {
      return opened ? "100px" : "0"; 
    }
  };
  return (
    <>
      <div
        onClick={() => setOpened(!opened)}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1000,
          backgroundColor: "#1C1C26",
        }}
      >
        <BiMenuAltLeft size={50} color="#EFEEEF" />
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: getSidebarWidth(),
          height: "100vh",
          backgroundColor: "#1C1C26",
          overflow: "hidden",
          transition: "width 0.3s ease",
          zIndex: 999,
        }}
      >
        <ScrollArea
          className="scroll-area"
          style={{ height: "calc(70vh - 60px)", marginTop: "90%" }}
          scrollbarSize={2}
        >
          {opened && (
            <div
              style={{
                display: "flex",
                color: "white",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
              }}
            >
              <Text
                color="lightgray"
                mb="md"
                align="center"
                style={{
                  color: "#838390",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <MdRemoveRedEye
                  size={30}
                  style={{ marginRight: 4, marginTop: 225 }}
                />
                Remover
              </Text>
              <Text
                color="lightgray"
                mb="md"
                align="center"
                style={{
                  color: "#838390",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <GiTunePitch
                  size={30}
                  style={{ marginRight: 4, marginTop: 30 }}
                />
                Pitcher
              </Text>
              <Text
                color="lightgray"
                mb="md"
                align="center"
                style={{
                  display: "flex",
                  color: "#838390",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <GiSplitArrows
                  size={30}
                  style={{ marginRight: 4, marginTop: 30 }}
                />
                Splitter
              </Text>
              <Text
                color="lightgray"
                mb="md"
                align="center"
                style={{
                  display: "flex",
                  color: "#838390",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <GiMarsPathfinder
                  size={30}
                  style={{ marginRight: 4, color: "#838390", marginTop: 30 }}
                />
                Key BPM Finder
              </Text>

              <Text
                color="lightgray"
                mb="md"
                align="center"
                style={{
                  display: "flex",
                  color: "#838390",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <GiBoltCutter
                  size={30}
                  style={{ marginRight: 2, marginTop: 30 }}
                />
                Cutter
              </Text>
              <Text
                color="lightgray"
                mb="md"
                align="center"
                style={{
                  display: "flex",
                  color: "#838390",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <GiJoin size={30} style={{ marginRight: 2, marginTop: 30 }} />
                Joiner
              </Text>
              <Text
                color="lightgray"
                mb="md"
                align="center"
                style={{
                  display: "flex",
                  color: "#838390",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <FaMicrophoneLines
                  size={30}
                  style={{ marginRight: 2, marginTop: 30 }}
                />
                Recorder
              </Text>
              <Text
                color="lightgray"
                mb="md"
                align="center"
                style={{
                  display: "flex",
                  color: "#838390",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <FaRecordVinyl
                  size={30}
                  style={{ marginRight: 2, marginTop: 30 }}
                />
                Karaoke
              </Text>
            </div>
          )}
        </ScrollArea>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            color: "#838390",
            padding: "16px 0",
          }}
        >
          <Text
            color="lightgray"
            style={{
              flex: 1,
              textAlign: "center",
              height: "50%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <MdOutlineContactSupport size={30} style={{ marginRight: 2 }} />
            Support
          </Text>
          <Image
            src={indian}
            alt="India"
            width={34}
            height={26}
            style={{
              marginTop: 20,
            }}
          />{" "}
        </div>
      </div>
    </>
  );
}
