import InfoPage from "@/components/infoPage";

export const metadata = {
  title: "About Us",
  description: "Learn more about our modern ecommerce store.",
};

export default function AboutPage() {
  return (
    <InfoPage title="About Us" intro="We make it easy to discover quality gadgets, appliances, and everyday essentials from trusted brands.">
      <h2>Shopping made simple</h2>
      <p>Shopcart brings useful products, dependable value, and a smooth shopping experience together in one place.</p>
      <h2>Our promise</h2>
      <p>We are committed to clear product information, secure account access, and helpful customer support from browsing to delivery.</p>
    </InfoPage>
  );
}
