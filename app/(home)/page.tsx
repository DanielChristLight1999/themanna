import Hero from "@/components/Home/Hero";
import Nav from "@/components/Home/Nav";

export default async function Home() {
  // const session = await auth()
  return (
    <div className="">
      <Nav />
      <Hero />
    </div>
  );
}
