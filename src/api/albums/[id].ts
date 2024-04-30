import { useQuery, useQueryClient } from "@tanstack/react-query";

import { db } from "@/db";
import type { AlbumWithTracks } from "@/db/schema";
import { formatForCurrentPages } from "@/db/utils/formatters";
import { albumKeys } from "./_queryKeys";

type QueryFnData = AlbumWithTracks;

export async function getAlbum({ albumId }: { albumId: string }) {
  const currentAlbum = await db.query.albums.findFirst({
    where: (fields, { eq }) => eq(fields.id, albumId),
    with: { tracks: true },
  });
  if (!currentAlbum) throw new Error(`Album ${albumId} doesn't exist.`);
  return currentAlbum;
}

type UseAlbumOptions<TData = QueryFnData> = {
  albumId: string | undefined;
  config?: {
    select?: (data: QueryFnData) => TData;
  };
};

/** @description Returns specified album with its tracks. */
export const useAlbum = <TData = QueryFnData>({
  albumId,
  config,
}: UseAlbumOptions<TData>) => {
  const queryClient = useQueryClient();

  return useQuery({
    enabled: Boolean(albumId),
    queryKey: albumKeys.detail(albumId!),
    queryFn: () => getAlbum({ albumId: albumId! }),
    placeholderData: () => {
      return queryClient
        .getQueryData<QueryFnData[]>(albumKeys.all)
        ?.find((d) => d?.id === albumId);
    },
    staleTime: Infinity,
    ...config,
  });
};

/**
 * @description Return data to render "MediaList" components on the
 *  `/album/[id]` route.
 */
export const useAlbumForCurrentPage = (albumId: string | undefined) =>
  useAlbum({
    albumId,
    config: {
      select: (data) => ({
        ...formatForCurrentPages({ type: "album", data }),
        artistName: data.artistName,
        imageSource: data.coverSrc,
        isFavorite: data.isFavorite,
      }),
    },
  });
