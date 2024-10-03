// pages/index.js
import { Container, Title, Button } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import AudioUploader from "../components/AudioUploader";

export default function Home() {
  return (
    <Container>
      <Sidebar /> 
      <AudioUploader />
    </Container>
  );
}
