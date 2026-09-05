
export type Post = {
  id: number,
  title: string,
  thumbnailUrl: string,
  createdAt: string,
  categories: string[],
  content: string,
};

type Category = {
  id: string,
  name: string,
};

export type MicroCmsPost = {
  id: string,
  title: string,
  content: string,
  createdAt: string,
  categories: Category[],
  thumbnail: { url: string; height: number; width: number },
};
