import useSWR from "swr";
import { Book } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Alert, Button, Container, Divider, NumberInput, TextInput, Textarea, Switch, TagsInput } from "@mantine/core";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconTrash, IconDeviceFloppy } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from '@tabler/icons-react';
import { rem } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';

interface BookFormValues {
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  category: string;
  cover: string;
}

export default function BookEditById() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const { data: book, isLoading, error } = useSWR<Book>(`/books/${bookId}`);
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  const theme = useMantineTheme();

  const bookEditForm = useForm<BookFormValues>({
    initialValues: {
      title: "",
      author: "",
      year: 2024,
      is_published: false,
      category: "",
      cover: "",
    },

    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      author: isNotEmpty("กรุณาระบุชื่อผู้แต่ง"),
      year: isNotEmpty("กรุณาระบุปีที่พิมพ์หนังสือ"),
    },
  });

  useEffect(() => {
    if (book && !isSetInitialValues) {
      bookEditForm.setInitialValues(book);
      bookEditForm.setValues(book);
      setIsSetInitialValues(true);
    }
  }, [book, bookEditForm, isSetInitialValues]);

  const handleSubmit = async (values: BookFormValues) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/books/${bookId}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${bookId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการแก้ไข",
            color: "red",
          });
        } else if (error.response?.status === 422) {
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

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/books/${bookId}`);
      notifications.show({
        title: "ลบหนังสือสำเร็จ",
        message: "ลบหนังสือเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate("/books");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการลบ",
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
          <h1 className="text-xl pb-4">แก้ไขข้อมูลหนังสือ</h1>

          {isLoading && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          {!!book && (
            <>
              <form onSubmit={bookEditForm.onSubmit(handleSubmit)} className="space-y-6">
                <TextInput
                  label="ชื่อหนังสือ"
                  placeholder="ชื่อหนังสือ"
                  {...bookEditForm.getInputProps("title")}
                />

                <TextInput
                  label="ชื่อผู้แต่ง"
                  placeholder="ชื่อผู้แต่ง"
                  {...bookEditForm.getInputProps("author")}
                />

                <NumberInput
                  label="ปีที่พิมพ์"
                  placeholder="ปีที่พิมพ์"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  {...bookEditForm.getInputProps("year")}
                />

                <Textarea
                  resize="vertical"
                  label="คำอธิบาย"
                  placeholder="เพิ่มคำอธิบาย"
                  {...bookEditForm.getInputProps("description")}
                />

                <Textarea
                  resize="vertical"
                  label="เรื่องย่อ"
                  placeholder="เพิ่มเรื่องย่อ"
                  {...bookEditForm.getInputProps("synopsis")}
                />

                <TagsInput
                  label="เพิ่มหมวดหมู่"
                  placeholder="เลือกหมวดหมู่"
                  value={bookEditForm.values.category ? bookEditForm.values.category.split(', ') : []}
                  onChange={(value) => {
                    // Join the tags with commas and set the formatted string
                    const formattedValue = value.join(', ');
                    bookEditForm.setFieldValue("category", formattedValue);
                  }}
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
                    'ศาสนาและปรัชญา (Religion & Philosophy)'
                  ]}
                />

                <TextInput
                  label="ภาพหน้าปก"
                  placeholder="ลิ้งก์สำหรับรูปภาพ"
                  {...bookEditForm.getInputProps("cover")}
                />

                <Switch
                  checked={bookEditForm.values.is_published}
                  onChange={(event) => bookEditForm.setFieldValue("is_published", event.currentTarget.checked)}
                  color="teal"
                  size="md"
                  label="เผยแพร่"
                  thumbIcon={
                    bookEditForm.values.is_published ? (
                      <IconCheck
                        style={{ width: rem(12), height: rem(12) }}
                        color={theme.colors.teal[6]}
                        stroke={3}
                      />
                    ) : (
                      <IconX
                        style={{ width: rem(12), height: rem(12) }}
                        color={theme.colors.red[6]}
                        stroke={3}
                      />
                    )
                  }
                />

                <Divider />

                <div className="flex justify-between pb-10">
                  <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="sm"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำเนินการลบหนังสือเล่มนี้แล้ว จะไม่สามารถย้อนกลับได้
                          </span>
                        ),
                        labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                        onConfirm: () => {
                          handleDelete();
                        },
                        confirmProps: {
                          color: "red",
                        },
                      });
                    }}
                  >
                    ลบหนังสือนี้
                  </Button>

                  <Button size="sm" type="submit" loading={isLoading || isProcessing}
                    leftSection={<IconDeviceFloppy />}>
                    บันทึกข้อมูล
                  </Button>
                </div>
              </form>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}