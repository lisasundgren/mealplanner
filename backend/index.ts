import express from 'express';
import database from './database.js'; // Vår databasmodul

const app = express();
const PORT = 3000;

app.use(express.json());

// EN TEST-ROUTE FÖR ATT HÄMTA RECEPT
app.get('/api/recipes', async (req, res) => {
  try {
    // Vi ställer en fråga (query) till Postgres-databasen
    const result = await database.query('SELECT * FROM recipes');

    // result.rows innehåller alla rader (recept) från tabellen
    res.json(result.rows);
  } catch (error) {
    console.error('Fel vid hämtning av recept:', error);
    res.status(500).json({ error: 'Kunde inte hämta data från databasen' });
  }
});

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
