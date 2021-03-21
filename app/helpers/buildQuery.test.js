const {expect} = require('chai');
const testee = require('./buildQuery.js');
const Heavy = require('../../spec/queryHeavy.json');
const queryLight = require('../../spec/queryLight.json');
const queryMedium = require('../../spec/queryMedium.json');

describe('buildQuery', () => {
    it('Максимально короткий запрос', () => {
        const expected = `SELECT slon.facts.user_id FROM slon.facts LIMIT 1000`
        const result = testee.buildQuery(queryLight);
        expect(result).to.equal(expected);
    });

    it('Средней сложности запрос', () => {
        const expected = `SELECT slon.facts.EventDate, slon.r_tags_v2.event_id FROM slon.facts \nJOIN slon.r_tags_v2 \nON slon.r_tags_v2.user_id = slon.facts.user_id LIMIT 100`
        const result = testee.buildQuery(queryMedium);
        expect(result).to.equal(expected);
    });

    it('Максимально длинный запрос', () => {
        const expected = `SELECT slon.facts.user_id, max(slon.facts.proposal_id) FROM slon.facts \nJOIN mviews.calltracking \nON mviews.calltracking.user_id = slon.facts.user_id WHERE (slon.facts.user_id > \'0\') AND (slon.facts.EventDate > \'2018-01-01\') AND (slon.facts.EventDate < \'2022-01-01\') GROUP BY slon.facts.user_id ORDER BY slon.facts.user_id ASC LIMIT 100`
        const result = testee.buildQuery(Heavy);
        expect(result).to.equal(expected);
    });
});
