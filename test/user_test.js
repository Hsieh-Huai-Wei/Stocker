require('dotenv').config();
const {assert, requester} = require('./set_up');
const {users} = require('./fake_data');

describe('user', () => {

    // natvie sign up
    it('sign up', async () => {
        const user = {
            name: 'test',
            email: 'test@gmail.com',
            pwd: '123456'
        };

        const res = await requester.post('/api/1.0/user/signup').send(user);

        const data = res.body.data;
        const userExpect = {
            id: data.user.id, // need id from returned data
            provider: 'native',
            name: user.name,
            email: user.email,
            picture: '123.jepg',
        };

        assert.deepEqual(data.user, userExpect);
        assert.equal(data.access_token.split('.')[2].length, 43);
        assert.equal(data.access_expired, Math.floor(Date.now() / 1000));
    });

    it('sign up without name or email or password', async () => {
        const user1 = {
            email: 'test1@gmail.com',
            password: '123456'
        };

        const res1 = await requester
            .post('/api/1.0/user/signup')
            .send(user1);

        assert.equal(res1.statusCode, 400);

        const user2 = {
            name: 'test1',
            password: '123456'
        };

        const res2 = await requester
            .post('/api/1.0/user/signup')
            .send(user2);

        assert.equal(res2.statusCode, 400);

        const user3 = {
            name: 'test1',
            email: 'test1@gmail.com',
        };

        const res3 = await requester
            .post('/api/1.0/user/signup')
            .send(user3);

        assert.equal(res3.statusCode, 400);
    });

    it('sign up with existed email', async () => {
        const user = {
          name: users[0].name,
          email: users[0].email,
          pwd: '123456',
        };

        const res = await requester
            .post('/api/1.0/user/signup')
            .send(user);
        assert.equal(res.body.error, '帳號已存在!');
    });

    it('sign up with malicious email', async () => {
        const user = {
          name: users[0].name,
          email: '<script>alert(1)</script>',
          pwd: 'password',
        };

        const res = await requester
            .post('/api/1.0/user/signup')
            .send(user);

        assert.equal(res.body.error, '信箱格式錯誤!');
    });

    // native sign in
    it('native sign in with correct password', async () => {
        const user1 = users[0];
        const user = {
          provider: Number(user1.provider_id),
          email: user1.email,
          pwd: user1.password,
        };

        const res = await requester
            .post('/api/1.0/user/signin')
            .send(user);

        const data = res.body.data;
        console.log(data);
        const userExpect = {
            id: data.user.id, // need id from returned data
            provider: Number(user1.provider_id),
            name: user1.name,
            email: user1.email,
            picture: '123.jepg',
        };

        assert.deepEqual(data.user, userExpect);
        assert.equal(data.access_token.split('.')[2].length, 43);
        assert.equal(data.access_expired, Math.floor(Date.now() / 1000));
    });

    it('native sign in without email or password', async () => {
        const user1 = users[0];
        const userNoEmail = {
          provider: Number(user1.provider_id),
          pwd: user1.password,
        };

        const res1 = await requester
            .post('/api/1.0/user/signin')
            .send(userNoEmail);

        assert.equal(res1.status, 400);
        assert.equal(res1.body.error, '信箱與密碼不可為空!，且密碼長度不得小於6位數!');

        const userNoPassword = {
            provider: Number(user1.provider_id),
            email: user1.email,
        };

        const res2 = await requester
            .post('/api/1.0/user/signin')
            .send(userNoPassword);

        assert.equal(res2.status, 400);
        assert.equal(res2.body.error, '信箱與密碼不可為空!，且密碼長度不得小於6位數!');
    });

    it('native sign in with wrong password', async () => {
        const user1 = users[0];
        const user = {
            provider: Number(user1.provider_id),
            email: user1.email,
            pwd: 'wrong password'
        };

        const res = await requester
            .post('/api/1.0/user/signin')
            .send(user);

        assert.equal(res.status, 403);
        assert.equal(res.body.error, '信箱不存在或密碼錯誤!');
    });

    it('native sign in with malicious password', async () => {
        const user1 = users[0];
        const user = {
            provider: user1.provider,
            email: user1.email,
            password: '" OR 1=1; -- '
        };

        const res = await requester
            .post('/api/1.0/user/signin')
            .send(user);

        assert.equal(res.status, 400);
        assert.equal(res.body.error, '信箱與密碼不可為空!，且密碼長度不得小於6位數!');
    });

    // get user profile
    it('get profile with invalid access_token', async () => {
        const user1 = users[0];
        const user = {
          token: user1.access_token,
        };
        const res = await requester
            .post('/api/1.0/user/profile')
            .set(user);

        assert.equal(res.status, 403);
        assert.equal(res.body.error, '登入逾時，請重新登入!');
    });

});