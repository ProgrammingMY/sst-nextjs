import { drizzle } from "drizzle-orm/d1"
import { Resource } from "sst"
import * as schema from "./schema"

export const db = () => {
    return drizzle(Resource.KelasTechDB, {
        schema: {
            ...schema
        }
    })
}