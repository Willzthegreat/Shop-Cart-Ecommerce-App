import InfoPage from "@/components/infoPage";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return <InfoPage title="Terms & Conditions" intro="These terms explain the rules for using Shopcart and placing orders with us.">
    <h2>Using Shopcart</h2><p>Use our website lawfully and provide accurate information when creating an account or placing an order.</p>
    <h2>Orders and payments</h2><p>Orders are subject to product availability and confirmation. Prices and availability may change without notice.</p>
    <h2>Accounts</h2><p>You are responsible for keeping your account details secure and for activity performed through your account.</p>
  </InfoPage>;
}
