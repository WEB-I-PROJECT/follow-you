const News = require('../models/News');
const compromise = require('compromise');
const natural = require('natural');
const stopwords = require('stopwords-pt'); // array of stopwords

function sortAndTakeMostFrequent(words) {
    const wordArray = Object.entries(words);

    const stemmedWords = wordArray.map(([word, frequency]) => ({
        word: word,
        frequency
    }));

    console.log(stemmedWords);

    // // Count the frequency of each stemmed word
    // const frequencyMap = stemmedWords.reduce((map, { word }) => {
    //     map[word] = (map[word] || 0) + 1;
    //     return map;
    // }, {});

    // Convert the frequency map to an array of objects
    // const sortedWords = Object.entries(frequencyMap).map(([word, frequency]) => ({
    //     word,
    //     frequency
    // }));

    // Sort the array based on frequency
    stemmedWords.sort((a, b) => b.frequency - a.frequency);

    const topWords = stemmedWords.slice(0, 500);

    return topWords;
}

async function tokenizeNews(id) {
    try {
        console.log(id);
        
        const allNews = await News.find({ analytic: id });

        const wordsAnalysis = allNews.reduce((analysis, news) => {
            const contentDoc = compromise(news.content);
            const titleDoc = compromise(news.title);

            const exclusionTerms = ['Fonte', 'Foto', 'Por', 'Jornal', '.com', '@','compartilhe', 'plataformasyoutubetiktokinstagramtwitter' ];

            const regex = /[^a-zA-Z]/g;;

            contentDoc.terms().data().forEach((wordData) => {
                const word = wordData.text.toLowerCase(); 
                if (exclusionTerms.every(term => !word.includes(term.toLowerCase())) && isNaN(word) && stopwords.every(term => word != term) && !regex.test(word) && word.length > 2) {
                    analysis.wordsInContent[word] = (analysis.wordsInContent[word] || 0) + 1;
                }
            });

            titleDoc.terms().data().forEach((wordData) => {
                const word = wordData.text.toLowerCase(); 
                if (exclusionTerms.every(term => !word.includes(term.toLowerCase())) &&  isNaN(word) && stopwords.every(term => word != term) && !regex.test(word) &&  word.length > 2) {
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
