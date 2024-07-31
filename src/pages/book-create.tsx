import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Checkbox, Container, Divider, NumberInput, TextInput, Textarea, TagsInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Book } from "../lib/models";
import { IconUpload, IconX } from '@tabler/icons-react';

export default function BookCreatePage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const bookCreateForm = useForm({
    initialValues: {
      title: "",
      author: "",
      year: 2024,
      is_published: false,
      description: "",
      synopsis: "",
      cover: "",
      category: []
    },

    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      author: isNotEmpty("กรุณาระบุชื่อผู้แต่ง"),
      year: isNotEmpty("กรุณาระบุปีที่พิมพ์หนังสือ"),
    },
  });

  const handleSubmit = async (values: typeof bookCreateForm.values) => {
    try {
      setIsProcessing(true);

      const formData = {
        ...values,
        category: values.category.join(",")  // Convert category array to comma-separated string
      };

      const response = await axios.post<Book>(`/books`, formData);
      notifications.show({
        title: "เพิ่มข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
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
          <h1 className="text-xl">เพิ่มหนังสือในระบบ</h1>
          <form onSubmit={bookCreateForm.onSubmit(handleSubmit)} className="space-y-5 py-5">
            <TextInput
              label="ชื่อหนังสือ"
              placeholder="ชื่อหนังสือ"
              {...bookCreateForm.getInputProps("title")}
            />

            <TextInput
              label="ชื่อผู้แต่ง"
              placeholder="ชื่อผู้แต่ง"
              {...bookCreateForm.getInputProps("author")}
            />

            <NumberInput
              label="ปีที่พิมพ์"
              placeholder="ปีที่พิมพ์"
              min={1900}
              max={new Date().getFullYear() + 1}
              {...bookCreateForm.getInputProps("year")}
            />

            <Textarea
              resize="vertical" 
              label="รายละเอียด"
              placeholder="รายละเอียด"
              {...bookCreateForm.getInputProps("description")}
            />

            <Textarea 
              resize="vertical"
              label="เรื่องย่อ"
              placeholder="เรื่องย่อ"
              {...bookCreateForm.getInputProps("synopsis")}
            />

            <TextInput
              label="ภาพหน้าปก"
              placeholder="ลิ้งก์สำหรับรูปภาพ"
              {...bookCreateForm.getInputProps("cover")}
            />

            <TagsInput
              label="หมวดหมู่"
              placeholder="เลือกหมวดหมู่"
              data={[
                'นิยาย (Fiction)',
                'สารคดี (Non-Fiction)',
                'การเรียน (Textbooks)',
                'ศิลปะ (Art)',
                'สุขภาพและการออกกำลังกาย (Health & Fitness)',
                'การพัฒนาตนเอง (Self-Help)',
                'ธุรกิจ (Business)',
                'การเดินทาง (Travel)',
                'การทำอาหาร (Cookbooks)',
                'เด็ก (Children\'s Books)',
                'การเงินส่วนบุคคล (Personal Finance)',
                'วิทยาศาสตร์ (Science)',
                'ความรู้ทั่วไป (General Knowledge)',
                'การเขียน (Writing)',
                'ศาสนาและปรัชญา (Religion & Philosophy)',
              ]}
              {...bookCreateForm.getInputProps("category")}
            />

            <Checkbox
              label="เผยแพร่"
              {...bookCreateForm.getInputProps("is_published", {
                type: "checkbox",
              })}
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
