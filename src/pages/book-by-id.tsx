import { Alert, Badge, Button, Container, Divider } from "@mantine/core";
import Layout from "../components/layout";
import { Link, useParams } from "react-router-dom";
import { Book } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconEdit } from "@tabler/icons-react";

export default function BookByIdPage() {
  const { bookId } = useParams();

  const { data: book, isLoading, error } = useSWR<Book>(`/books/${bookId}`);

  const getCategoryBadges = (categories: string) => {
    if (!categories) return [];
    return categories.split(',').map(cat => cat.trim());
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

          {!!book && (
            <>
              <h1>{book.title}</h1>
              <p className="italic text-neutral-500 mb-4">โดย {book.author}</p>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <img
                  src={book.cover ? book.cover : "https://placehold.co/150x200"}
                  alt={book.title}
                  className="w-full object-cover aspect-[3/4] rounded-md"
                />
                <div className="col-span-2 px-10 space-y-2 py-4">
                  <h3>รายละเอียดหนังสือ</h3>
                  <p className="indent-4">
                    {book.description}
                  </p>

                  <h3>เรื่องย่อ</h3>
                  <p className="indent-4">
                    {book.synopsis}
                  </p>

                  <h3>หมวดหมู่</h3>
                  <div className="flex flex-wrap gap-2">
                    {getCategoryBadges(book.category).map((category, index) => (
                      <Badge key={index} color="teal">
                        #{category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Divider className="mt-4" />

              <Button
                color="blue"
                size="sm"
                radius="md"
                component={Link}
                to={`/books/${book.id}/edit`}
                className="my-4 transform transition-transform duration-300 hover:scale-105"
                leftSection={<IconEdit />}
              >
                แก้ไขข้อมูลหนังสือ
              </Button>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
