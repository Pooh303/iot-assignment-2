import useSWR from "swr";
import { Menus } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Alert, Button, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconTrash, IconDeviceFloppy } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Switch, useMantineTheme, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function MenuEditById() {
  const { menuId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: menu, isLoading, error } = useSWR<Menus>(`/menu/${menuId}`);
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  const theme = useMantineTheme();
  const menuEditForm = useForm({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      available: false,
      image: "",
    },

    validate: {
      name: isNotEmpty("กรุณาระบุชื่อเมนู"),
      description: isNotEmpty("กรุณาระบุรายละเอียดเมนู"),
      price: isNotEmpty("กรุณาระบุราคาของเมนู"),
    },
  });

  const handleSubmit = async (values: typeof menuEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/menu/${menuId}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลเมนูสำเร็จ",
        message: "ข้อมูลเมนูได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menu/${menuId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลเมนู",
            message: "ไม่พบข้อมูลเมนูที่ต้องการแก้ไข",
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
      await axios.delete(`/menu/${menuId}`);
      notifications.show({
        title: "ลบเมนูสำเร็จ",
        message: "ลบเมนูนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate("/menu");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลเมนู",
            message: "ไม่พบข้อมูลเมนูที่ต้องการลบ",
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

  useEffect(() => {
    if (!isSetInitialValues && menu) {
      menuEditForm.setInitialValues(menu);
      menuEditForm.setValues(menu);
      setIsSetInitialValues(true);
    }
  }, [menu, menuEditForm, isSetInitialValues]);

  return (
    <>
      <Layout>
        <Container className="mt-8">
        <Button
              className="relative my-5"
              variant="transparent"
              onClick={() => navigate(-1)}
            >
            <IconX size={28} /> ยกเลิก
          </Button>
          <h1 className="text-xl pb-4">แก้ไขข้อมูลเมนู</h1>

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

          {!!menu && (
            <>
              <form onSubmit={menuEditForm.onSubmit(handleSubmit)} className="space-y-6">
                <TextInput
                  label="ชื่อเมนู"
                  placeholder="ชื่อเมนู"
                  {...menuEditForm.getInputProps("name")}
                />

                <TextInput
                  label="รายละเอียดเมนู"
                  placeholder="รายละเอียดเมนู"
                  {...menuEditForm.getInputProps("description")}
                />

                <NumberInput
                  label="ราคา"
                  placeholder="ราคา"
                  min={0}
                  {...menuEditForm.getInputProps("price")}
                />

                <TextInput
                  label="รูปภาพ"
                  placeholder="ลิ้งก์สำหรับรูปภาพ"
                  {...menuEditForm.getInputProps("image")}
                />

                <Switch
                  checked={menuEditForm.values.available}
                  onChange={(event) => menuEditForm.setFieldValue("available", event.currentTarget.checked)}
                  color="teal"
                  size="md"
                  label="มีจำหน่าย"
                  thumbIcon={
                    menuEditForm.values.available ? (
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

                <div className="flex justify-between">
                  <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="sm"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบเมนูนี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำเนินการลบเมนูนี้แล้ว จะไม่สามารถย้อนกลับได้
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
                    ลบเมนูนี้
                  </Button>

                  <Button type="submit" loading={isLoading || isProcessing}
                  size="sm" leftSection={<IconDeviceFloppy />}>
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
