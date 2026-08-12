import InfoPage from "@/components/infoPage";

const Contact = () => {
  return (
    <InfoPage title="Contact Us" intro="Have a question about an order, product, or delivery? Our team is ready to help.">
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2>Get in touch</h2>
          <p>Email us at <a href="mailto:shopcart@gmail.com">shopcart@gmail.com</a> or call +234 12 958 648 597.</p>
          <p>We are available Monday to Saturday, 10:00 AM to 7:00 PM.</p>
        </div>
        <form className="not-prose space-y-4 rounded-lg border bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium">Name<input required name="name" className="mt-1 w-full rounded border p-3" /></label>
          <label className="block text-sm font-medium">Email<input required type="email" name="email" className="mt-1 w-full rounded border p-3" /></label>
          <label className="block text-sm font-medium">Message<textarea required name="message" rows={5} className="mt-1 w-full rounded border p-3" /></label>
          <button type="submit" className="w-full rounded bg-shop-dark-green px-5 py-3 font-semibold text-white">Send message</button>
        </form>
      </div>
    </InfoPage>
  )
}

export default Contact
