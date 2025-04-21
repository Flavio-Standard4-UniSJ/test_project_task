document.getElementById("search-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const keyword = document.getElementById("keyword").value.trim();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
  
    if (!keyword) {
      alert("Por favor, digite uma palavra-chave.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/api/scrape?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
  
      const products = data.products; // <-- importante: buscar array do campo products
  
      if (!Array.isArray(products)) {
        resultsDiv.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
      }
  
      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
  
        productDiv.innerHTML = `
          <img src="${product.image}" alt="Imagem do Produto" />
          <h3>${product.title || "Sem título"}</h3>
          <p>Classificação: ${product.rating || "N/A"}</p>
          <p>Avaliações: ${product.reviews || "N/A"}</p>
        `;
  
        resultsDiv.appendChild(productDiv);
      });
  
      if (products.length === 0) {
        resultsDiv.innerHTML = "<p>Nenhum produto encontrado.</p>";
      }
  
    } catch (error) {
      console.error("Erro na requisição:", error);
      resultsDiv.innerHTML = "<p>Erro: Não foi possível obter os dados.</p>";
    }
  });
  