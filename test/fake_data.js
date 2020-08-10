const users = [
    {
      number: '1',
      name: 'test1',
      email: 'test1@gmail.com',
      password: '123456',
      picture: '123.jepg',
      provider_id: '1',
      access_token: 'test1accesstoken',
      access_expired: 123456789,
    },
    {
      number: '2',
      name: 'test2',
      email: 'test2@gmail.com',
      password: '456789',
      picture: '456.jepg',
      provider_id: '2',
      access_token: 'test2accesstoken',
      access_expired: 123456789,
    },
];

const save = [
    {
      user_id:1,
      stock_code:2492,
      trend:[{'startDate':20200310,'startPrice':206,'endDate':20200319,'endPrice':130.5},{'startDate':20200319,'startPrice':130.5,'endDate':20200415,'endPrice':198}],
      start:20190731,
      end:20200731,
      upper:1000,
      lower:100,
      graph:'reverseV',
      count:25,
      increase:0,
      decrease:0,
    },
];

module.exports = {
    users,
    save,
};