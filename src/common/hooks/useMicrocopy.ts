import { BLOCKS, Document } from "@contentful/rich-text-types";
import { useMemo } from "react";

import type {
  IMicrocopy,
  IMicrocopyRichText,
} from "../types/generated/contentful";

export interface MicrocopyCollection {
  get(key: string): string;
  getDocument(key: string): Document;
}

export function useMicrocopy(
  microcopy: ReadonlyArray<IMicrocopy | IMicrocopyRichText>
): MicrocopyCollection {
  return useMemo<MicrocopyCollection>(() => {
    const aStrings = microcopy.filter(
      (m) => m.sys.contentType.sys.id === "microcopy"
    ) as IMicrocopy[];
    const mapStrings = new Map(
      aStrings.map((m) => [m.fields.key, m.fields.value])
    );

    const aDocuments = microcopy.filter(
      (m) => m.sys.contentType.sys.id === "microcopyRichText"
    ) as IMicrocopyRichText[];
    const mapDocuments = new Map(
      aDocuments.map((m) => [m.fields.key, m.fields.value])
    );

    return {
      get(key) {
        const value = mapStrings.get(key);
        if (typeof value === "undefined") {
          console.warn(`microcopy key ${key} was not found in collection`);
        }
        return value ?? key;
      },
      getDocument(key) {
        const value = mapDocuments.get(key);
        if (typeof value === "undefined") {
          console.warn(
            `microcopy rich text key ${key} was not found in collection`
          );
          const fakeDocument: Document = {
            nodeType: BLOCKS.DOCUMENT,
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                content: [
                  {
                    nodeType: "text",
                    data: { key },
                    value: key,
                    marks: [{ type: key }],
                  },
                ],
                data: { key },
              },
            ],
            data: { key },
          };
          return fakeDocument;
        }

        return value;
      },
    };
  }, [microcopy]);
}
