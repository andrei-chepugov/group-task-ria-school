const {expect} = require('chai');
const testee = require('./buildQuery.js');
const params1 = require('../../spec/query1.json')
const params2 = require('../../spec/query2.json')

describe('buildQuery', () => {
    it('Максимально короткий запрос', () => {
        const expected = `SELECT slon.facts.user_id FROM slon.facts LIMIT 1000`
        const result = testee.buildQuery(params2);
        expect(result).to.equal(expected);
    });

    it('Максимально длинный запрос', () => {
        const expected = `SELECT slon.facts.user_id, max(slon.facts.proposal_id) FROM slon.facts \nJOIN mviews.calltracking \nON mviews.calltracking.user_id = slon.facts.user_id WHERE (slon.facts.user_id > \'0\') AND (slon.facts.EventDate > \'2018-01-01\') AND (slon.facts.EventDate < \'2022-01-01\') GROUP BY slon.facts.user_id ORDER BY slon.facts.user_id ASC LIMIT 100`
        const result = testee.buildQuery(params1);
        expect(result).to.equal(expected);
    });
});
