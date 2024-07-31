import { useState, useEffect } from 'react';
import { Container, Table, Loader, Alert, Center, Text } from '@mantine/core';
import Layout from "../components/layout";
import axios from 'axios';

interface Item {
  menu_id: number;
  menu_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  time: string;
  date: string;
  items: Item;
  note: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders data from the backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders');
        const data = Array.isArray(response.data) ? response.data : [];

        // Parse the items field from JSON strings to objects
        const parsedOrders = data.map((order: any) => ({
          ...order,
          items: typeof order.items === 'string'
            ? JSON.parse(order.items) // Parse JSON string to object/array
            : Array.isArray(order.items) ? order.items : [order.items] // Handle both single object and array cases
        }));

        setOrders(parsedOrders);
        console.log("Fetched Orders Data:", parsedOrders); // Log the entire orders data
      } catch (error) {
        setError('Error fetching orders data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Container
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <Loader color="blue" size="xl" type="bars" />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return <Alert color="red" title="Error">{error}</Alert>;
  }

  return (
    <Layout>
      <Container>
        <h1 className='my-5'>รายการออเดอร์</h1>

        {orders.length === 0 ? (
          <Center style={{ height: '60vh' }}>
            <Text
              size="5vh"
              fw={900}
              variant="gradient"
              gradient={{ from: 'rgba(179, 179, 179, 0.33)', to: 'rgba(181, 181, 181, 1)', deg: 100 }}
            >
              ยังไม่มีรายการออเดอร์
            </Text>
          </Center>
        ) : (
          <Table
            style={{
              marginBottom: '30px',
              position: 'relative',            
              width: '100%'
            }}
          >
            <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ไอดี</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>วันเวลา</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>เลขเมนู</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ชื่อเมนู</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>จำนวน</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ราคา</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr style={{ border: '1px solid #ddd' }} key={order.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} {' '}
                    {order.time}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{order.items.menu_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{order.items.menu_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{order.items.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{order.items.price}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{order.note}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </Layout>
  );
}
