import dynamic from "next/dynamic";
import Hero from "@/components/scene/Hero";

const Descent = dynamic(() => import("@/components/scene/Descent"));
const Manifesto = dynamic(() => import("@/components/scene/Manifesto"));
const ComingSoon = dynamic(() => import("@/components/scene/ComingSoon"));

export default function Home() {
  return (
    <main>
      <Hero />
      <Descent />
      <Manifesto />
      <ComingSoon />
    </main>
  );
}
