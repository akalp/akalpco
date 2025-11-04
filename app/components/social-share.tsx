import React from "react";
import { FiTwitter, FiFacebook } from "react-icons/fi";
import { RiRedditLine, RiBlueskyLine } from "react-icons/ri";

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
          title="X (Twitter)"
          aria-label="Share on X (Twitter)"
        >
          <FiTwitter className="h-5 w-5" />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Share on Facebook"
        >
          <FiFacebook className="h-5 w-5" />
        </a>
        <a
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Share on Reddit"
        >
          <RiRedditLine className="h-5 w-5" />
        </a>
        <a
          href={shareLinks.bluesky}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Share on Bluesky"
        >
          <RiBlueskyLine className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
