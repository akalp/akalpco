import { ContactMethods } from "./components/contact-methods";
import { contactMetadata } from "../config/metadata";

export const metadata = contactMetadata;

export default function ContactPage() {
  return (
    <div className="container-width py-6 md:py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="heading-1 mb-6">Get in Touch</h1>
        <p className="body-text mb-12">
          I&apos;m always interested in hearing about new opportunities,
          collaborations, or just having a chat about technology and
          development. Feel free to reach out through any of the following
          methods.
        </p>

        <ContactMethods />
      </div>
    </div>
  );
}
