import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface LocationResourceDoc extends BaseDoc {
  name: string;
  description: string;
  start: Date;
  status: string;
  location: [number, number];
}

export default class LocationResourceConcept {
  public readonly locationResources = new DocCollection<LocationResourceDoc>("locationResources");

  async create(name: string, description: string, start: Date, status: string, location: [number, number]) {
    const _id = await this.locationResources.createOne({ name, description, start, status, location });
    return { msg: "Location Resource successfully created!", locationResource: await this.locationResources.readOne({ _id }) };
  }

  async getLocationResources(query: Filter<LocationResourceDoc>) {
    const locationResources = await this.locationResources.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return locationResources;
  }

  async getById(_id: ObjectId) {
    return await this.getLocationResources({ _id });
  }

  async getByCoordinate(coordinate: [number, number]) {
    return await this.getLocationResources({ coordinate });
  }

  async delete(_id: ObjectId) {
    await this.locationResources.deleteOne({ _id });
    return { msg: "Location Resource deleted successfully!" };
  }

  async update(_id: ObjectId, update: Partial<LocationResourceDoc>) {
    await this.locationResources.updateOne({ _id }, update);
    return { msg: "Location Resource successfully updated!" };
  }

}
