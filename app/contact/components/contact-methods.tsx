"use client";

import { ContactCard } from "./contact-card";
import { contacts } from "@/app/data/contacts";

export function ContactMethods() {
  return (
    <div className="grid gap-6">
      {contacts.map((method) => (
        <ContactCard key={method.name} method={method} />
      ))}
    </div>
  );
}
