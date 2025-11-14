//LAZY stub o(--(
const processItemDescription = async (description) => {
    //self reminder to put some actual deepseek calls here...
  return {
    category: 'Electronics',
    summary: description, // For now, just echo
    tags: ['sample', 'tag'],
  };
};
const matchLostItem = async (query, itemList) => {
  // another call
  const results = itemList.map(item => {
    const score = query
      .toLowerCase()
      .split(' ')
      .reduce((acc, word) => {
        if (
          item.name.toLowerCase().includes(word) ||
          item.description.toLowerCase().includes(word) ||
          item.tags.some(t => t.toLowerCase().includes(word))
        ) {
          return acc + 0.2;
        }
        return acc;
      }, 0);

    return { id: item.id, matchPercentage: Math.min(score, 1) };
  });

  return results;
};
module.exports = {
  processItemDescription,
};
