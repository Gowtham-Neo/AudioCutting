// pages/index.js
import { Container, Title, Button } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import AudioUploader from "../components/AudioUploader";

export default function Home() {
  return (
    <Container style={{ backgroundColor: "#16161E" }}>
      <Sidebar />
      <AudioUploader />
    </Container>
  );
}
