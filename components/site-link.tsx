import NextLink from 'next/link';
import type { ComponentProps } from 'react';

// Project exports use normal page loads: GitHub Pages has no RSC server.
// href is already prefixed by sitePath at each call site.
export default function SiteLink(props: ComponentProps<'a'> & { href: string }) {
  return process.env.NEXT_PUBLIC_BASE_PATH
    ? <a {...props} />
    : <NextLink {...props} />;
}
