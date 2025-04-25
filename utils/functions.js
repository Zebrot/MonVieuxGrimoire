exports.getTopThree = (arr) => {
    const results = [];

    for (const book of arr) {
        let inserted = false;
        for (let i = 0; i < results.length; i++) {
            if (book.averageRating > results[i].averageRating) {
                results.splice(i, 0, book); 
                inserted = true;
                break;
            }
        }
  
        if (!inserted && results.length < 3) {
            results.push(book); 
        }
        if (results.length > 3) {
            results.pop();
        }
    }
    return results;
}
