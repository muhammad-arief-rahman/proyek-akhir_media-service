import { z } from "zod"

const multerFile = z.custom<Express.Multer.File>(
  (file) => {
    return (
      file &&
      typeof file === "object" &&
      "fieldname" in file &&
      "originalname" in file &&
      "mimetype" in file &&
      "size" in file &&
      typeof file.fieldname === "string" &&
      typeof file.originalname === "string" &&
      typeof file.mimetype === "string" &&
      typeof file.size === "number"
    )
  },
  {
    message: "File must be a valid multer file",
  }
)

export const mediaStoreSchema = z
  .array(multerFile, {
    required_error: "Pathnames are required",
    invalid_type_error: "Pathnames must be an array of files",
  })
  .min(1, {
    message: "At least one file is required",
  })

export type MediaStoreSchema = z.infer<typeof mediaStoreSchema>
