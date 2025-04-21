const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: 'Palavra-chave não fornecida' });
  }

  try {
    const response = await axios.get(`https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },      
    });

    console.log(response.data.substring(0, 1000));

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const items = document.querySelectorAll('[data-component-type="s-search-result"]');

    const results = [];

    items.forEach(item => {
      const titleElem =
        item.querySelector('h2 a span') ||
        item.querySelector('span.a-text-normal');

      const ratingElem = item.querySelector('.a-icon-alt');
      const reviewCountElem = item.querySelector('.a-size-base.s-underline-text');
      const imageElem = item.querySelector('img.s-image');

      const title = titleElem ? titleElem.textContent.trim() : null;

      // Somente adiciona se tiver título e o título contiver a palavra-chave
      if (title) {
        results.push({
          title,
          rating: ratingElem ? ratingElem.textContent.trim() : 'Sem avaliação',
          reviewCount: reviewCountElem ? reviewCountElem.textContent.trim() : 'Sem reviews',
          image: imageElem ? imageElem.src : '',
        });
      }
    });

    res.json(results);
  } catch (error) {
    console.error('Erro na extração:', error.message);
    res.status(500).json({ error: 'Erro ao buscar dados da Amazon' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
