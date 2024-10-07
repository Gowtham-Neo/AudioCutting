
import { useState } from "react";
import { Container } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import AudioUploader from "../components/AudioUploader";

export default function Home() {
  const [opened, setOpened] = useState(true);
  return (
    <Container style={{ backgroundColor: "#16161E" }}>
      <Sidebar opened={opened} setOpened={setOpened} />
      <AudioUploader isActive={opened} />
    </Container>
  );
}
