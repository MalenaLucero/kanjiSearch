const fetch = require('node-fetch')
const fs = require('fs')

const jlpt4Kanjis = require('./kanjiData/jlpt4Kanjis')
const notJlpt4Kanjis = require('./kanjiData/notJlpt4Kanjis')
const uploadedKanji = notJlpt4Kanjis.concat(jlpt4Kanjis)

const expressions = require('./expressions')

const kanjiArray = expressions.map(e => e.word).join('').split('')
    .filter(char => char.charCodeAt() >= 13312 && char.charCodeAt() < 65306)
const kanjiSet = new Set(kanjiArray)
const notUploadedKanji = Array.from(kanjiSet).filter(kanji => {
    if (!uploadedKanji.includes(kanji)) {
        return kanji
    }
})

const populateTxtFiles = kanjiToSearch => {
    kanjiToSearch.forEach(kanji => {
        const URI = 'https://kanjiapi.dev/v1/kanji/' + kanji
        const encodedURI = encodeURI(URI)
        
        fetch(encodedURI)
            .then(res => res.json())
            .then(json => {
                if (json.jlpt === 4) {
                    fs.appendFile('./txtFiles/jlpt4.txt', `'${json.kanji}',\r\n`, () => {})
                } else {
                    fs.appendFile('./txtFiles/kanjiData.txt', `${JSON.stringify(json)},\r\n`, () => {})
                    fs.appendFile('./txtFiles/notJlpt4Kanjis.txt', `'${json.kanji}',\r\n`, () => {})
                }
            })
            .catch(error => console.log(error))
    })
}

populateTxtFiles(notUploadedKanji)

