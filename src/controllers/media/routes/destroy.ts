import { internalServerError, response } from "@ariefrahman39/shared-utils"
import type { RequestHandler } from "express"
import prisma from "../../../lib/db"
import { deleteFile } from "../../../lib/utils"

const destroy: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params

    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      response(res, 404, "Media not found")
      return
    }

    // Delete the media file from storage
    await deleteFile(media.path)

    // Delete the media record from the database
    await prisma.media.delete({
      where: { id },
    })

    response(res, 200, "Media deleted successfully")
  } catch (error) {
    console.error("Error in destroy route:", error)
    internalServerError(res, error)
  }
}

export default destroy
