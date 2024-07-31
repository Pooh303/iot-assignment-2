import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Menus } from "../lib/models";
import { IconUpload, IconX } from '@tabler/icons-react';

export default function MenuCreatePage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const menuCreateForm = useForm({
    initialValues: {
      name: "",
      price: "",
      description: "",
      image: "", // Added image field to initial values
      available: false,
    },

    validate: {
      name: isNotEmpty("กรุณาระบุชื่อเมนู"),
      price: isNotEmpty("กรุณาระบุราคาของเมนู"),
      description: isNotEmpty("กรุณาระบุคำอธิบายของเมนู"),
    },
  });

  const handleSubmit = async (values: typeof menuCreateForm.values) => {
    try {
      setIsProcessing(true);
  
      // Convert price to number if needed
      const formData = {
        ...values,
        price: parseFloat(values.price),
      };
  
      const response = await axios.post<Menus>(`/menu`, formData);
      notifications.show({
        title: "เพิ่มข้อมูลเมนูสำเร็จ",
        message: "ข้อมูลเมนูได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menu/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        // Safely access status code using optional chaining
        const status = error.response?.status;
  
        if (status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (status && status >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        } else {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <Layout>
        <Container className="mt-8">
          <Button
            className="relative my-4"
            variant="transparent"
            onClick={() => navigate(-1)}
          >
            <IconX size={28} /> ยกเลิก
          </Button>
          <h1 className="text-xl">เพิ่มเมนูในระบบ</h1>
          <form onSubmit={menuCreateForm.onSubmit(handleSubmit)} className="space-y-5 py-5">
            <TextInput
              label="ชื่ออาหาร"
              placeholder="ชื่ออาหาร"
              {...menuCreateForm.getInputProps("name")}
            />

            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              min={0}
              {...menuCreateForm.getInputProps("price")}
            />

            <Textarea
              resize="vertical" 
              label="คำอธิบาย"
              placeholder="คำอธิบาย"
              {...menuCreateForm.getInputProps("description")}
            />

            <TextInput
              label="รูปภาพ"
              placeholder="ลิ้งก์สำหรับรูปภาพ"
              {...menuCreateForm.getInputProps("image")}
            />

            <Divider />
            <Button type="submit" loading={isProcessing} leftSection={<IconUpload />}>
              บันทึกข้อมูล
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}
