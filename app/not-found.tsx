import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex flex-col items-center py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="headline-display mt-3 text-4xl sm:text-5xl">This bite is off the menu.</h1>
      <p className="mt-4 max-w-md text-mute">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">Back home</Link>
        <Link href="/news" className="btn-outline">Read the news</Link>
      </div>
    </div>
  );
}
