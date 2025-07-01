import { internalServerError, response } from "@ariefrahman39/shared-utils"
import type { RequestHandler } from "express"
import prisma from "../../../lib/db"
import path from "path"

const serve: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params

    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      response(res, 404, "Media not found")
      return
    }

    console.log("Serving media:", media)
    
    res.setHeader("Content-Type", media.type)
    res.setHeader("Content-Disposition", `inline; filename="${media.name}"`)
    res.setHeader("Content-Length", media.size.toString())

    const absolutePath = path.resolve("storage/" + media.path)
    res.sendFile(absolutePath)

    return
  } catch (error) {
    console.error("Error serving media:", error)
    
    internalServerError(res, error)
  }
}

export default serve
