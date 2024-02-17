const News = require('../models/News');
const compromise = require('compromise');
const stopwords = require('stopwords-pt');

function sortAndTakeMostFrequent(words) {
    const wordArray = Object.entries(words);

    const stemmedWords = wordArray.map(([word, frequency]) => ({
        word: word,
        frequency
    }));

    stemmedWords.sort((a, b) => b.frequency - a.frequency);

    const topWords = stemmedWords.slice(0, 500);

    return topWords;
}

async function tokenizeNews(id) {
    try {
        
        const allNews = await News.find({ analytic: id });

        const wordsAnalysis = allNews.reduce((analysis, news) => {
            const contentDoc = compromise(news.content);
            const titleDoc = compromise(news.title);

            const exclusionTerms = ['Fonte', 'Foto', 'Por', 'Jornal', '.com', '@', 'compartilhe', 'plataformasyoutubetiktokinstagramtwitter', 'disse'];

            const regex = /[^a-zA-Z]/g;;

            contentDoc.terms().data().forEach((wordData) => {
                const word = wordData.text.toLowerCase();
                if (exclusionTerms.every(term => !word.includes(term.toLowerCase())) && isNaN(word) && stopwords.every(term => word != term) && !regex.test(word) && word.length > 2) {
                    analysis.wordsInContent[word] = (analysis.wordsInContent[word] || 0) + 1;
                }
            });

            titleDoc.terms().data().forEach((wordData) => {
                const word = wordData.text.toLowerCase();
                if (exclusionTerms.every(term => !word.includes(term.toLowerCase())) && isNaN(word) && stopwords.every(term => word != term) && !regex.test(word) && word.length > 2) {
                    analysis.wordsInTitle[word] = (analysis.wordsInTitle[word] || 0) + 1;
                }
            });


            return analysis;
        }, { wordsInContent: {}, wordsInTitle: {} });

        const mostFrequentWordsInContent = sortAndTakeMostFrequent(wordsAnalysis.wordsInContent);
        const mostFrequentWordsInTitle = sortAndTakeMostFrequent(wordsAnalysis.wordsInTitle);

        return {
            mostFrequentWordsInContent: mostFrequentWordsInContent,
            mostFrequentWordsInTitle: mostFrequentWordsInTitle,
        }
    } catch (error) {
        return {};
    }
}


module.exports = tokenizeNews
