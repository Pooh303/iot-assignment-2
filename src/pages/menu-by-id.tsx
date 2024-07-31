import { Alert, Button, Container, Divider, NumberInput, Textarea } from "@mantine/core";
import Layout from "../components/layout";
import { Link, useParams } from "react-router-dom";
import { Menus } from "../lib/models";
import useSWR from "swr";
import { useNavigate } from 'react-router-dom';
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconEdit, IconSquareCheckFilled, IconSquareRoundedXFilled, IconBasketPlus } from "@tabler/icons-react";
import { useState } from "react";
import { modals } from "@mantine/modals";
import axios from 'axios';

export default function MenuByIdPage() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { data: menu, isLoading, error } = useSWR<Menus>(`/menu/${menuId}`);

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const totalPrice = menu ? menu.price * quantity : 0;

  const handleOrderClick = () => {
    modals.openConfirmModal({
      title: (
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          ยืนยันการสั่งอาหาร
        </div>
      ),
      children: (
        <div>
          <p>คุณต้องการสั่ง {menu?.name} × {quantity} หรือไม่?</p>
          <p>ราคาทั้งหมด: {totalPrice.toLocaleString('th-TH')} บาท</p>
        </div>
      ),
      labels: { confirm: 'ยืนยัน', cancel: 'ยกเลิก' },
      onConfirm: async () => {
        if (menu) {
          try {
            const item = JSON.stringify({
              menu_id: menu.id,
              menu_name: menu.name,
              quantity: quantity,
              price: menu.price
            })
            const orderData = {
              items: item,
              date: new Date().toISOString(),
              time: new Date().toLocaleTimeString(),
              note: note
            };

            await axios.post('/orders', orderData);
            navigate('/success');
          } catch (error) {
            console.error('Error creating order:', error);
          }
        } else {
          console.error('Menu is undefined.');
        }
      },
      confirmProps: { color: 'green' },
      cancelProps: { color: 'red' },
    });
  };

  return (
    <>
      <Layout>
        <Container className="mt-4">
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
              <h1>{menu.name}</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <img
                  src={menu.image ? menu.image : "https://placehold.co/150x200"}
                  alt={menu.name}
                  className="w-full object-cover aspect-[4/4] rounded-xl my-5"
                />
                <div className="col-span-2 px-10 space-y-4 py-4">
                  <h3>รายละเอียด</h3>
                  <p className="indent-4">
                    {menu.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3>สถานะ : </h3>
                    {menu.available ? (
                      <>
                        <IconSquareCheckFilled color="green" style={{ marginLeft: '0.5rem' }} />
                        <span style={{ marginLeft: '0.5rem' }}>มีจำหน่าย</span>
                      </>
                    ) : (
                      <>
                        <IconSquareRoundedXFilled color="red" style={{ marginLeft: '0.5rem' }} />
                        <span style={{ marginLeft: '0.5rem' }}>หมด</span>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 className="pr-2">จำนวน :</h3>
                    <NumberInput
                      radius="md"
                      min={1}
                      value={quantity}
                      onChange={(value) => setQuantity(Number(value) || 1)}
                      style={{ width: '80px' }}
                    />
                  </div>

                  <h2 className="text-neutral-1200 mb-4">ราคา {totalPrice.toLocaleString('th-TH')} บาท</h2>
                  <Textarea
                    resize="vertical"
                    placeholder="หมายเหตุ e.g. หวานน้อย"
                    style={{ width: '400px' }}
                    value={note}
                    onChange={(event) => setNote(event.currentTarget.value)}
                  />
                </div>
              </div>

              <Divider />
              <div className="flex justify-between">
                <Button
                  color="blue"
                  size="sm"
                  component={Link}
                  radius="md"
                  to={`/menu/${menu.id}/edit`}
                  leftSection={<IconEdit />}
                  className="mt-4 transform transition-transform duration-300 hover:scale-105"
                >
                  แก้ไขข้อมูลเมนู
                </Button>

                <Button
                  color="green"
                  size="sm"
                  onClick={handleOrderClick}
                  radius="md"
                  leftSection={<IconBasketPlus />}
                  className="my-4 transform transition-transform duration-200 hover:scale-105"
                  disabled={!menu.available}
                >
                  สั่งอาหาร
                </Button>
              </div>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
