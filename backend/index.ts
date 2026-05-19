import express, { type Request, type Response } from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

// Enkel test-route med TypeScript-typer (: Request, : Response)
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Backenden rullar på med nodemon och TypeScript!" });
});

app.listen(PORT, () => {
  console.log(`Servern är igång på http://localhost:${PORT}`);
});
