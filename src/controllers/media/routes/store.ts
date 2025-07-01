import { internalServerError, response } from "@ariefrahman39/shared-utils"
import type { RequestHandler } from "express"
import { ZodError } from "zod"
import prisma from "../../../lib/db"
import { saveFile } from "../../../lib/utils"
import { mediaStoreSchema } from "../../../schema/media/store"

const store: RequestHandler = async (req, res) => {
  try {
    const parsedData = mediaStoreSchema.parse(req.files ?? [])

    const mediaIds = await Promise.all(
      parsedData.map(async (file) => {
        const mediaFile = await saveFile(file, "media-files")

        console.log("Media File", mediaFile)

        const media = await prisma.media.create({
          data: {
            path: mediaFile.path,
            name: mediaFile.originalname,
            extension: mediaFile.extension,
            size: mediaFile.size,
            type: mediaFile.mimetype,
          },
        })

        return media.id
      })
    )

    response(res, 200, "Successfully stored media", mediaIds)
  } catch (error) {
    if (error instanceof ZodError) {
      response(res, 422, "Validation error", error.errors, {
        validationType: "ZodError",
      })
    }

    internalServerError(res, error)
  }
}

export default store
