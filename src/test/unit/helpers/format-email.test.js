// test/unit/helpers/format-email.test.js
const assert = require('assert');
const formatEmail = require('../../../api/helpers/format-email.js');

describe('formatEmail Helper', () => {
    it('Should format the email to lowercase and remove spaces between characters successfully', async () => {
        const email = '  Exemplo@Email.com  ';
        const expectedFormattedEmail = 'exemplo@email.com';

        const result = await formatEmail.fn({ email }, { success: (result) => result });

        assert.strictEqual(result, expectedFormattedEmail, 'The formatted email should be lowercase and without spaces');
    });

    it('Should keep the email already correctly formatted', async () => {
        const email = 'exemplo@email.com';
        const expectedFormattedEmail = 'exemplo@email.com';

        const result = await formatEmail.fn({ email }, { success: (result) => result });

        assert.strictEqual(result, expectedFormattedEmail, 'The already formatted email should remain unchanged');
    });

    it('Should handle emails with spaces only at the beginning and the end', async () => {
        const email = '  exemplo@email.com  ';
        const expectedFormattedEmail = 'exemplo@email.com';

        const result = await formatEmail.fn({ email }, { success: (result) => result });

        assert.strictEqual(result, expectedFormattedEmail, 'Spaces at the beginning and the end should be removed');
    });
});
