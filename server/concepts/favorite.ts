import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface FavoriteDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
}

export default class FavoriteConcept {
  public readonly favorites = new DocCollection<FavoriteDoc>("favorites");

  async createFavorite(author: ObjectId, target: ObjectId) {
    const _id = await this.favorites.createOne({ author, target });
    return { msg: "Favorite successfully created!", Favorite: await this.favorites.readOne({ _id }) };
  }

  async delete(_id: ObjectId) {
    await this.favorites.deleteOne({ _id });
    return { msg: "Favorite deleted successfully!" };
  }

  async getFavorites(query: Filter<FavoriteDoc>) {
    const Favorite = await this.favorites.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return Favorite;
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const Favorite = await this.favorites.readOne({ _id });
    if (!Favorite) {
      throw new NotFoundError(`Favorite ${_id} does not exist!`);
    }
    if (Favorite.author.toString() !== user.toString()) {
      throw new FavoriteAuthorNotMatchError(user, _id);
    }
  }
}

export class FavoriteAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of Favorite {1}!", author, _id);
  }
}
