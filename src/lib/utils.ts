import fs from "fs"
import path from "path"

export function saveFile(
  file: Express.Multer.File,
  destination: string,
  filename?: string
) {
  return new Promise<string>((resolve, reject) => {
    try {
      // Check if the base storage directory exists (/storage), if not create it
      const storageDir = path.join(process.cwd(), "storage")
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true })
      }

      // Check if the destination directory exists, if not create it
      const fullDestination = path.join(storageDir, destination)
      if (!fs.existsSync(fullDestination)) {
        fs.mkdirSync(fullDestination, { recursive: true })
      }

      // If no filename is provided, create a unique hash-based filename without using the original file name
      // But also provide the original extension if it exists
      const hash = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`
      const ext = path.extname(file.originalname) || ".bin" // Default to .bin if no extension
      const formattedFilename = filename ?? `${hash}${ext}` // Use the provided filename or generate a new one


      // Create the full file path and write the file stream to it
      const filePath = path.join(fullDestination, formattedFilename)

      fs.writeFile(filePath, file.buffer, (error) => {
        if (error) {
          reject(error)
        } else {
          // Resolves with the relative path to the file
          resolve(path.join(destination, formattedFilename))
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

export function deleteFile(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    const fullPath = path.join(process.cwd(), "storage", filePath)

    fs.unlink(fullPath, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

export function fileExists(filePath: string) {
  const fullPath = path.join(process.cwd(), "storage", filePath)
  return fs.existsSync(fullPath)
} 
