import Layout from "../components/layout";
// import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
// import coffeeImage from "../assets/images/coffee-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import taKrittanut from "../assets/images/p-no.jpg";
import ME from "../assets/images/me.jpg";
import itKMITL from "../assets/videos/itkmitl.mp4";
import { Text, Paper, Image } from '@mantine/core';

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white flex flex-col justify-center items-center px-4 text-center"
      >
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "blur(10px)",
            zIndex: -1,
            // height: 550,
            backgroundPosition: 'center'
          }}
        >
          <source src={itKMITL} type="video/mp4" />
        </video>
        <Text
          style={{ padding: "20px" }}
          size="3rem"
          fw={900}
          variant="gradient"
          gradient={{ from: 'blue', to: 'pink', deg: 50 }}
        >
          ยินดีต้อนรับสู่ IT Café & Book
        </Text>
        <Text
        style={{
          padding: "10px",
          fontSize: "1.5rem",
          fontWeight: 600,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
        }}
      >
        ไอที คาเฟ่ และหนังสือ ที่ผสมผสานกันได้อย่างลงตัว
      </Text>
      </section>

      <section className="container mx-auto py-8 mb-20">
      <h1 className="text-center text-white text-2xl font-bold mb-2">เกี่ยวกับเรา</h1>
        <Paper shadow="sm" radius="lg" p="xl">
          <Text>
          IoT Library & Cafe เป็นร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
                และเรียนรู้เรื่องใหม่ๆ ที่เกี่ยวกับเทคโนโลยี IoT โดยคาเฟ่ของเรานั้น ก่อตั้งขึ้นโดย
                ผศ.ดร. ปานวิทย์ ธุวะนุติ ซึ่งเป็นอาจารย์ในวิชา Internet of Things และนายกฤตณัฏฐ์
                ศิริพรนพคุณ เป็นผู้ช่วยสอนในหัวข้อ FastAPI และ React ในวิชานี้
          </Text>
        </Paper>
        
    <div className="grid grid-cols-3 gap-1 pt-10">
      <div className="flex justify-center items-center h-80 w-80">
        <Image
          radius="md"
          src={ajPanwitImage}
          alt="Panwit Tuwanut"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex justify-center items-center h-80 w-80">
        <Image
          radius="md"
          src={ME}
          alt="65070182 Phowadol Sriphanna"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex justify-center items-center h-80 w-80">
        <Image
          radius="md"
          src={taKrittanut}
          alt="Krittanut Siripornnoppakhun"
          className="h-full w-full object-cover"
        />
      </div>
    </div>


        <p className="text-right mt-8">
        ปัจจุบัน ไอที ค่าเฟ่ และหนังสือ อยู่ในช่วงการดูแลของ นายภูวดล ศรีพันนา, รหัสประจำตัวนักศึกษา 65070182 
        ซึ่งดูแลสถานที่นี้ด้วยความรักและใส่ใจเหมือนแม่ที่ดูแลลูกในวันแรกที่ไปโรงเรียน และยังได้รวบรวมบริการระดับน้ำตกเจ็ดยอดสู่ผู้ใช้บริการนานับประการ 
        ทั้งกาแฟร้อนที่ไม่เพียงแค่ทำให้คุณตื่น และหนังสือดีๆระดับคุณภาพ ทั้งหมดนี้ถูกบรรจุและคัดสรรด้วยความรักและความเอาใจใส่อย่างพิถีพิถัน
        </p>
      </section>
    </Layout>
    
  );
}
