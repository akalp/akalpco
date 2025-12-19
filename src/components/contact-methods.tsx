"use client";

import { ContactCard } from "@/components/contact-card";
import { contacts } from "@/data/contacts";

export function ContactMethods() {
  return (
    <div className="grid gap-6">
      {contacts.map((method) => (
        <ContactCard key={method.name} method={method} />
      ))}
    </div>
  );
}
