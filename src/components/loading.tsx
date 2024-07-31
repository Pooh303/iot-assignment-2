import { Loader } from "@mantine/core";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full my-4">
      <Loader color="rgba(0, 0, 0, 1)" size="xl" type="dots" />

      {/* <div className="text-xl text-neutral-500">กำลังโหลด</div> */}
    </div>
  );
}