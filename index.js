'use strict'

const cheerio = require('cheerio');

const transformer = require('./transformer');
const helpers = require('./helpers');
const goodReadsJSONResponse = {};


goodReadsJSONResponse.convertToJson = (xmlData) => {
    const options = {
        xml: {
            normalizeWhitespace: true
        }
    };
    const $ = cheerio.load(xmlData, options);
    const response = {};
    transformer.mappings.forEach((item, index) => {
        const type = item.transformer_type;
        let element = type;
        if ($(element).html() === null) return;
        response[element] = {};
        const resp = response[element];
        const mapping = item.mapping;
        mapping.forEach((mapItem, index2) => {
            if (element === 'popular_shelves') {
                if ($('popular_shelves').find('shelf').length <= 0) return;
                if (mapItem.helper && helpers[mapItem.helper]) {
                    resp[mapItem.jsonKey] = helpers[mapItem.helper]($('popular_shelves').find('shelf'));
                }
            } else if (element === 'similar_books') {
                if ($('similar_books').find('book').length <= 0) return;
                const resp = [];
                $('similar_books').find('book').map((book) => {
                    console.log($('similar_books').find('book')[book].attribs);
                });
            } else {
                const element2 = element + ' ' + mapItem.key;
                resp[mapItem.jsonKey] = $(element2).html();
                if (mapItem.helper && helpers[mapItem.helper]) {
                    resp[mapItem.jsonKey] = helpers[mapItem.helper](resp[mapItem.jsonKey]);
                }
            }
        });
    });
    return response;
};

module.exports = goodReadsJSONResponse;
