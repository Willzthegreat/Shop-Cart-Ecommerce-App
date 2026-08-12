import InfoPage from "@/components/infoPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <InfoPage title="Privacy Policy" intro="We respect your privacy and only use your information to provide and improve our services.">
    <h2>Information we collect</h2><p>We may collect details such as your name, email, delivery information, and order history when you use Shopcart.</p>
    <h2>How we use information</h2><p>Information helps us process orders, support your account, communicate with you, and improve the store.</p>
    <h2>Your choices</h2><p>You can contact us to ask about your personal information or request help with your account details.</p>
  </InfoPage>;
}
