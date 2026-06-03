import { PostTitle } from "@/app/_components/post-title";

import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  readingTime: number;
};

export function PostHeader({ title, coverImage, date, readingTime }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="mx-auto mb-8 max-w-5xl md:mb-10">
        <CoverImage title={title} src={coverImage} eager />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-3 text-base text-neutral-600">
          <DateFormatter dateString={date} />
          <span aria-hidden="true">·</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </>
  );
}
