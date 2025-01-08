import React from "react";
import { Twitter, Facebook } from "lucide-react";
import { Bird } from "lucide-react";

type ShareButtonProps = {
  url: string;
  title: string;
};

export function SocialShare({ url, title }: ShareButtonProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-secondary">Share this article:</span>
      <div className="flex gap-2">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Share on X (Twitter)"
        >
          <Twitter className="h-5 w-5" />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Share on Reddit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            <path d="M14.5 11.5c-1-1-2.5-1.5-4-1.5s-3 .5-4 1.5" />
            <path d="M8.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            <path d="M12 13.5V17" />
          </svg>
        </a>
        <a
          href={shareLinks.bluesky}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Share on Bluesky"
        >
          <Bird className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
