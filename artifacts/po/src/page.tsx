import HeroReveal from "@/components/HeroReveal";
import ScrollRevealText from "@/components/ScrollRevealText";
import Credibility from "@/components/Credibility";
import Books from "@/components/Books";
import Testimonials from "@/components/Testimonials";
import Speaking from "@/components/Speaking";
import Footer from "@/components/Footer";
import BookingSection from "@/components/BookingSection";

const bioText = `Eman Ali is a working ghostwriter specializing in contemporary romance, historical romance, and historical fiction. Over the past several years she has written full-length novels on commission for publishers, packagers, and serialized fiction platforms across multiple countries, delivering finished manuscripts under her clients' names rather than her own. Nearly everything she writes is protected by non-disclosure agreements, which means the books themselves stay private even as the work behind them keeps piling up.

That work now totals more than a hundred and ten full-length books and upward of seven and a half million words. On Upwork, where much of that history is verifiable, she holds *Top Rated Plus* status with a perfect job success score and has earned well into six figures on the platform. Alongside client work, she also publishes original novels of her own on *Amazon* under a pen name, which keeps her fluent in both sides of the business.`;

export default function Home() {
  return (
    <>
      <HeroReveal
        src="/hero-photo.jpg"
        alt=""
      />

      {/* ABOUT / EDITORIAL TEXT */}
      <div id="about">
        <ScrollRevealText text={bioText} />
      </div>

      <Credibility />

      {/* BOOKS */}
      <div id="books">
        <Books />
      </div>

      <Testimonials />

      {/* CONTACT / WORK WITH EMAN */}
      <Speaking />

      {/* GET STARTED / CAL.COM */}
      <BookingSection />

      <Footer />
    </>
  );
}
