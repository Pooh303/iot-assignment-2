import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cf.jpg";
import useSWR from "swr";
import { Menus } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function MenuPage() {
  const { data: menus, error } = useSWR<Menus[]>("/menu");

  // Debugging: Log error and data
  console.log('Menus:', menus);
  console.log('Error:', error);

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
            backgroundPosition: 'center'
          }}
        >
          <h1 className="text-5xl mb-2">อาหาร&เครื่องดื่ม</h1>
          <h2>รายการอาหารทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>รายการอาหาร</h1>

            <Button
              radius="md"
              component={Link}
              leftSection={<IconPlus />}
              to="/menu/create"
              size="sm"
              className="flex items-center space-x-2 transform transition-transform duration-50 hover:scale-110"
              variant="gradient"
              gradient={{ from: 'red', to: 'orange', deg: 90 }}
            >
              เพิ่มอาหาร
            </Button>
          </div>

          {!menus && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-5">
            {menus?.map((menu) => (
              <div className="border border-solid border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out" key={menu.id}>
                <img
                  src={menu.image ? menu.image : "https://placehold.co/150x200"}
                  alt={menu.name}
                  className="w-full object-cover aspect-[4/4] rounded-t-md"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{menu.name}</h2>
                  <p className="text-xs text-neutral-500">{menu.description}</p>
                </div>

                <div className="flex justify-end px-4 pb-2">
                  <Button component={Link} to={`/menu/${menu.id}`} size="xs" variant="default" radius="md">
                    ดูรายละเอียด
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
