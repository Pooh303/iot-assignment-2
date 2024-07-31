import Layout from "../components/layout";
import libraryBackgroundImage from "../assets/images/bg-lb.jpg";
import useSWR from "swr";
import { Book } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function BooksPage() {
  const { data: books, error } = useSWR<Book[]>("/books");

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-blue-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${libraryBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">หนังสือ</h1>
          <h2>รายการหนังสือทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>รายการหนังสือ</h1>

            <Button
              radius="md"
              component={Link}
              leftSection={<IconPlus />}
              to="/books/create"
              size="sm"
              // variant="primary"
              className="flex items-center space-x-2 transform transition-transform duration-50 hover:scale-110"
              variant="gradient"
              gradient={{ from: 'cyan', to: 'blue', deg: 90 }}
            >
              เพิ่มหนังสือ
            </Button>
          </div>

          {!books && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 pt-5">
            {books?.map((book) => (
              <div className="border border-solid border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out" key={book.id}>
                <img
                  src={book.cover ? book.cover : "https://placehold.co/150x200"}
                  alt={book.title}
                  className="w-full object-cover aspect-[3/4]"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{book.title}</h2>
                  <p className="text-xs text-neutral-500">โดย {book.author}</p>
                </div>

                <div className="flex justify-end px-4 pb-2">
                  <Button component={Link} to={`/books/${book.id}`} size="xs" variant="default" radius="md">
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
