import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { createId } from "@/lib/cuid2";

export const artists = sqliteTable("artists", {
  name: text("name").primaryKey(),
  // FIXME: Potentially add `logo` field in the future.
});
export type Artist = InferSelectModel<typeof artists>;

export const artistsRelations = relations(artists, ({ many }) => ({
  albums: many(albums),
  tracks: many(tracks),
}));

export const albums = sqliteTable("albums", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  artistName: text("artist_name")
    .notNull()
    .references(() => artists.name),
  name: text("name").notNull(),
  coverSrc: text("cover_src"),
  releaseYear: integer("release_year"),
  isFavorite: integer("is_favorite", { mode: "boolean" })
    .notNull()
    .default(false),
});
export type Album = InferSelectModel<typeof albums>;

export const albumsRelations = relations(albums, ({ one, many }) => ({
  artist: one(artists, {
    fields: [albums.artistName],
    references: [artists.name],
  }),
  tracks: many(tracks),
}));

export const tracks = sqliteTable("tracks", {
  id: text("id").primaryKey(),
  artistName: text("artist_name")
    .notNull()
    .references(() => artists.name),
  albumId: text("album_id").references(() => albums.id),
  name: text("name").notNull(),
  coverSrc: text("cover_src"),
  track: integer("track").notNull().default(-1), // Track number in album if available
  duration: integer("duration").notNull(), // Track duration in seconds
  isFavorite: integer("is_favorite", { mode: "boolean" })
    .notNull()
    .default(false),
  uri: text("uri").notNull(),
  modificationTime: integer("modification_time").notNull(),
  fetchedCover: integer("fetched_cover", { mode: "boolean" })
    .notNull()
    .default(false),
});
export type Track = InferSelectModel<typeof tracks>;

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  artist: one(artists, {
    fields: [tracks.artistName],
    references: [artists.name],
  }),
  album: one(albums, { fields: [tracks.albumId], references: [albums.id] }),
  tracksToPlaylists: many(tracksToPlaylists),
}));

export const invalidTracks = sqliteTable("invalid_tracks", {
  id: text("id").primaryKey(),
  uri: text("uri").notNull(),
  modificationTime: integer("modification_time").notNull(),
});
export type InvalidTrack = InferSelectModel<typeof invalidTracks>;

export const playlists = sqliteTable("playlists", {
  name: text("name").primaryKey(),
  coverSrc: text("cover_src"),
  isFavorite: integer("is_favorite", { mode: "boolean" })
    .notNull()
    .default(false),
});
export type Playlist = InferSelectModel<typeof playlists>;

export const playlistsRelations = relations(playlists, ({ many }) => ({
  tracksToPlaylists: many(tracksToPlaylists),
}));

export const tracksToPlaylists = sqliteTable(
  "tracks_to_playlists",
  {
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id),
    playlistName: text("playlist_name")
      .notNull()
      .references(() => playlists.name),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.trackId, t.playlistName] }),
  }),
);

export const tracksToPlaylistsRelations = relations(
  tracksToPlaylists,
  ({ one }) => ({
    playlist: one(playlists, {
      fields: [tracksToPlaylists.playlistName],
      references: [playlists.name],
    }),
    track: one(tracks, {
      fields: [tracksToPlaylists.trackId],
      references: [tracks.id],
    }),
  }),
);
