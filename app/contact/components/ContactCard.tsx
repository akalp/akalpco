"use client";

import { motion } from "motion/react";
import type { ContactMethod } from "@/app/types/contact";

export function ContactCard({ method }: { method: ContactMethod }) {
  const Icon = method.icon;
  
  const cardContent = (
    <>
      <div className="text-secondary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h2 className="font-semibold">{method.name}</h2>
        <p className="text-secondary">{method.value}</p>
      </div>
    </>
  );

  return (
    <motion.div
      key={method.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {method.href ? (
        <a
          href={method.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-6 rounded-lg border border-muted bg-background p-6 transition-colors hover:border-primary"
        >
          {cardContent}
        </a>
      ) : (
        <div className="flex items-center gap-6 rounded-lg border border-muted bg-background p-6">
          {cardContent}
        </div>
      )}
    </motion.div>
  );
} 