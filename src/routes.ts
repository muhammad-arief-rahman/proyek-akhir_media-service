import { Router } from "express"
import MediaController from "./controllers/media"

const router = Router()

router.get("/", (req, res) => {
  res.status(204).send()
})

router.post("/data", MediaController.store)
router.get("/data/:id", MediaController.serve)
router.delete("/data/:id", MediaController.destroy)

export default router
