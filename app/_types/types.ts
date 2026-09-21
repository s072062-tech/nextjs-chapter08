
export type Post = {
  id: number,
  title: string,
  thumbnailImageKey: string,
  createdAt: string,
  categories: string[],
  content: string,
};

export type PropsParams = {
  params: Promise<{id: string}>,
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
