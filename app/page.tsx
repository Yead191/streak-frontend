import Hero from "@/components/scene/Hero";
import Descent from "@/components/scene/Descent";
import Manifesto from "@/components/scene/Manifesto";
import ComingSoon from "@/components/scene/ComingSoon";

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
