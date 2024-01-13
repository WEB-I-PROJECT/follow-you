function createSlug(word) {

  let slug = word.toLowerCase();

  slug = slug.replace(/\s+/g, '-');

  slug = slug.replace(/[^\w-]/g, '');

  const accentsMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
    'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
    'ã': 'a', 'ñ': 'n', 'õ': 'o',
    'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u'
  };

  slug = slug.replace(/[áéíóúâêîôûàèìòùãñõäëïöü]/g, char => accentsMap[char] || char);

  return slug;
}

module.exports = createSlug;