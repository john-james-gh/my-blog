import Link from "next/link";

const Header = () => {
  return (
    <div className="mb-20 mt-8">
      <Link href="/" className="text-base text-neutral-600 hover:underline">
        ← All posts
      </Link>
    </div>
  );
};

export default Header;
