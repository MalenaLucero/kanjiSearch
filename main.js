const fetch = require('node-fetch')
const fs = require('fs')

const expressions = require('./260621expressions')
const kanjis260621 = require('./260621kanjis.js')

const kanjiArray = expressions.map(e => e.word).join('').split('')
    .filter(char => char.charCodeAt() >= 13312 && char.charCodeAt() < 65306)
const kanjiSet = new Set(kanjiArray)

const populateTxtFiles = kanjiSet => {
    kanjiSet.forEach(kanji => {
        const URI = 'https://kanjiapi.dev/v1/kanji/' + kanji
        const encodedURI = encodeURI(URI)
        
        fetch(encodedURI)
            .then(res => res.json())
            .then(json => {
                if (json.jlpt === 4) {
                    fs.appendFile('./jlpt4.txt', json.kanji, () => {})
                } else {
                    fs.appendFile('./kanjiData.txt', JSON.stringify(json) + ",\r\n", () => {})
                }
            })
            .catch(error => console.log(error))
    })
}


