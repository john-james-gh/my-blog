import { PostTitle } from "@/app/_components/post-title";

import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
};

export function PostHeader({ title, coverImage, date }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="mx-auto mb-8 max-w-5xl md:mb-10">
        <CoverImage title={title} src={coverImage} eager />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  );
}
