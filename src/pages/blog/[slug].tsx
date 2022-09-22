import imageUrlBuilder from '@sanity/image-url';
import { useRouter } from 'next/router';
import { groq } from 'next-sanity';
import { ReactNode } from 'react';

import LandingPageLayout from '../../components/LandingPageLayout';
import ProseableText from '../../components/ProseableText';
import { getClient, usePreviewSubscription } from '../../lib/sanity';

const query = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    content,
    coverImage,
    "slug": slug.current,
    body,
    mainImage
  }
`;

function urlFor(source: string) {
  return imageUrlBuilder(getClient(false)).image(source);
}

const Post = (props: any) => {
  const { postdata, preview } = props;

  const router = useRouter();

  const { data: post } = usePreviewSubscription(query, {
    params: { slug: postdata?.post?.slug },
    initialData: postdata,
    enabled: preview || router.query.preview !== undefined,
  });

  if (!post) {
    return null;
  }

  return (
    <>
      <article>
        <div
          style={{
            background: `url(${urlFor(post.mainImage).url()})`,
            width: '100%',
            height: '500px',
            backgroundSize: 'cover',
            backgroundPositionY: -120,
          }}
        />
        <div className="flex xl:justify-center">
          <div className="px-8 lg:px-32 py-8">
            <h1 className="text-xl lg:text-3xl font-semibold text-gray-900">
              {post.title}
            </h1>
            <div className="mt-4 flex">
              <ProseableText value={post.body} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

interface StaticPropsParams {
  slug: string;
}

export async function getStaticProps({
  params,
  preview = false,
}: {
  params: StaticPropsParams;
  preview: boolean;
}) {
  const post = await getClient(preview).fetch(query, {
    slug: params.slug,
  });

  return {
    props: {
      postdata: post,
      preview,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const slugs: string[] = await getClient(false).fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );

  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: true,
  };
}

Post.getLayout = (page: ReactNode) => {
  return <LandingPageLayout>{page}</LandingPageLayout>;
};

export default Post;
