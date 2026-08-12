import InfoPage from "@/components/infoPage";

export const metadata = { title: "Help" };

export default function HelpPage() {
  return <InfoPage title="Help" intro="Find quick guidance for using your Shopcart account and managing your shopping experience.">
    <h2>Need help with an order?</h2><p>Check your account dashboard for order information and delivery details.</p>
    <h2>Need help with your account?</h2><p>Make sure your email and password are correct, then contact us if you still cannot sign in.</p>
    <h2>Still need assistance?</h2><p>Our support team can help with products, orders, accounts, and delivery questions through the Contact Us page.</p>
  </InfoPage>;
}
