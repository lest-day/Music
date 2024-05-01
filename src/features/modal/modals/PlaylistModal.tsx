import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSetAtom } from "jotai";

import { useToggleFavorite } from "@/api/favorites/[id]";
import { usePlaylistForModal } from "@/api/playlists/[id]";
import { useDeletePlaylistCover } from "@/features/playlist/api/deletePlaylistCover";
import { useUpdatePlaylistCover } from "@/features/playlist/api/updatePlaylistCover";
import { modalAtom } from "../store";

import { mutateGuard } from "@/lib/react-query";
import { ModalBase } from "../components/ModalBase";
import { Button } from "../components/ModalInteractive";
import { ScrollRow, Title } from "../components/ModalUI";

/** @description Modal used for playlists. */
export function PlaylistModal({ playlistName }: { playlistName: string }) {
  const openModal = useSetAtom(modalAtom);
  const { isPending, error, data } = usePlaylistForModal(playlistName);
  const toggleFavoriteFn = useToggleFavorite({
    type: "playlist",
    id: playlistName,
  });
  const updatePlaylistCover = useUpdatePlaylistCover(playlistName);
  const deletePlaylistCover = useDeletePlaylistCover(playlistName);

  if (isPending || error) return null;

  // Add optimistic UI updates.
  const isToggled = toggleFavoriteFn.isPending
    ? !data.isFavorite
    : data.isFavorite;

  return (
    <ModalBase detached>
      <BottomSheetScrollView>
        <Title asLine className="mb-8 px-4">
          {data.name}
        </Title>

        <ScrollRow>
          <Button
            content={isToggled ? "Unfavorite" : "Favorite"}
            icon={isToggled ? "FavoriteFilled" : "FavoriteOutline"}
            onPress={() => mutateGuard(toggleFavoriteFn, undefined)}
            dontCloseOnPress
          />
          <Button
            content="Rename"
            icon="MatchCaseOutline"
            onPress={() =>
              openModal({
                type: "playlist-name",
                id: playlistName,
                origin: "update",
              })
            }
          />
          <Button
            content="Change Cover"
            icon="ImageOutline"
            onPress={() => mutateGuard(updatePlaylistCover, undefined)}
          />
          {typeof data.imageSource === "string" && (
            <Button
              content="Remove Cover"
              icon="HideImageOutline"
              onPress={() => mutateGuard(deletePlaylistCover, undefined)}
            />
          )}
          <Button
            content="Delete"
            icon="DeleteOutline"
            onPress={() =>
              openModal({ type: "playlist-delete", id: playlistName })
            }
          />
        </ScrollRow>
      </BottomSheetScrollView>
    </ModalBase>
  );
}
