import { Box, Group, Badge } from "@mantine/core";
import websiteLogo from "../assets/images/coffee.png";
import { Link } from "react-router-dom";
import useSWR from 'swr';
import axios from 'axios';

interface LayoutProps {
  children: React.ReactNode;
}

// Function to fetch all orders and count them
const fetchOrders = async () => {
  const response = await axios.get('/orders');
  return response.data.length; // Return the count of orders
};

export default function Layout({ children }: LayoutProps) {
  // Fetch the order count
  const { data: orderCount, error } = useSWR('orderCount', fetchOrders);

  if (error) {
    console.error('Error fetching orders:', error);
    // Handle error or display a fallback UI
  }

  return (
    <>
      <Box>
        <header className="h-30 px-8 border border-t-0 border-x-0 border-solid border-neutral-200 bg-white">
          <div className="flex justify-between">
            <div>
              <a href="/"><img src={websiteLogo} alt="Logo" className="h-14 w-auto" /></a>
            </div>

            <Group className="h-14 gap-0">
              <Link
                to={"/"}
                className="flex items-center h-14 px-1 no-underline text-neutral-600 font-semibold text-md"
              >
                หน้าหลัก
              </Link>

              <Link
                to={"/books"}
                className="flex items-center h-14 px-1 no-underline text-neutral-600 font-semibold text-md"
              >
                หนังสือ
              </Link>

              <Link
                to={"/menu"}
                className="flex items-center h-14 px-1 no-underline text-neutral-600 font-semibold text-md"
              >
                เมนู
              </Link>
            </Group>

            <div>
              <Link
                to={"/order"}
                className="flex items-center h-14 px-1 no-underline text-neutral-600 font-semibold text-md"
              >
                {orderCount >= 1 && (
                  <Badge size="xs" color="red" className="mr-1" circle>
                    {orderCount}
                  </Badge>
                )}
                ออเดอร์
              </Link>
            </div>
          </div>
        </header>
      </Box>

      <main>{children}</main>
    </>
  );
}
