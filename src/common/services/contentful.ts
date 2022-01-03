import { ContentfulClientApi, createClient } from "contentful";

export interface PageNotFoundErrorInit {
  readonly slug: string;
}

export class PageNotFoundError extends Error {
  readonly _slug: string;

  constructor(init: PageNotFoundErrorInit) {
    super(`page not found with slug ${init.slug}`);
    this._slug = init.slug;
  }

  get slug(): string {
    return this._slug;
  }
}

export interface PageParams {
  readonly locale?: string;
}

export class ContentfulContentService {
  readonly contentful: ContentfulClientApi;

  constructor(contentful: ContentfulClientApi) {
    this.contentful = contentful;
  }

  async fetchPageBySlug<T>(slug: string, params: PageParams = {}): Promise<T> {
    const collection = await this.contentful.getEntries<T>({
      content_type: "microcopyPage",
      limit: 1,
      locale: params.locale,
      "fields.slug": slug,
    });
    const [page] = collection.items;
    if (!page) {
      throw new PageNotFoundError({ slug });
    }
    return page.fields;
  }

  async healthcheck(): Promise<void> {
    await this.contentful.getSpace();
  }
}

export const contentful = createClient({
  accessToken:
    process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ||
    process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN ||
    "unset",
  environment: process.env.CONTENTFUL_ENVIRONMENT || undefined,
  space: process.env.CONTENTFUL_SPACE_ID || "unset",
  host: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    ? "preview.contentful.com"
    : undefined,
});

export const instance = new ContentfulContentService(contentful);
