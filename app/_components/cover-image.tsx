import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  src: string;
  slug?: string;
  eager?: boolean;
};

const CoverImage = ({ title, src, slug, eager = false }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn("h-full w-full object-cover shadow-sm", {
        "hover:shadow-lg transition-shadow duration-200": slug,
      })}
      width={1300}
      height={630}
      loading={eager ? "eager" : "lazy"}
    />
  );
  return (
    <div
      className={cn("aspect-[16/9] max-h-[520px] overflow-hidden", {
        "mx-auto": !slug,
      })}
    >
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title} className="block h-full">
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
