import InfoPage from "@/components/infoPage";

export const metadata = { title: "FAQs" };

const questions = [
  ["How do I place an order?", "Browse the store, add products to your cart, and follow the checkout instructions."],
  ["Can I update my delivery details?", "Yes. Open your profile and manage your saved delivery information."],
  ["How can I contact support?", "Visit the Contact Us page or email shopcart@gmail.com."],
  ["What if an item is out of stock?", "You can check back later or browse similar products in the same category."],
];

export default function FaqPage() {
  return <InfoPage title="FAQs" intro="Here are answers to some common Shopcart questions.">
    <div className="not-prose space-y-3">{questions.map(([question, answer]) => <details key={question} className="rounded-lg border bg-white p-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm leading-6 text-gray-600">{answer}</p></details>)}</div>
  </InfoPage>;
}
