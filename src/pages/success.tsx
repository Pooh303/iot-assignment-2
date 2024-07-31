import { Container, Button, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import Layout from "../components/layout";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [seconds, setSeconds] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Layout>
      <Container className="mt-4 text-center">
        <h1 className="text-2xl font-bold mb-4">สั่งอาหารสำเร็จ!</h1>
        <IconCheck size={48} color="green" className="mb-4" />
        <p className="mb-4">คำสั่งซื้อของคุณได้รับการบันทึกเรียบร้อยแล้ว</p>
        <Text className="mb-4">
          จะกลับสู่หน้าหลักใน <strong>{seconds}</strong> วินาที
        </Text>
        <Button
          component={Link}
          to="."
          color="blue"
          radius="md"
          className="mt-4 mr-1"
        >
          กลับสู่หน้าหลัก
        </Button>
        <Button
          component={Link}
          to="/menu"
          color="green"
          radius="md"
          className="mt-4 ml-1"
        >
          สั่งอาหารต่อ
        </Button>
      </Container>
    </Layout>
  );
}
