const common = {
  getList: function (req, res, next) {
    res.send({
      returnEntity: [
        {
          id: '000001',
          name: '1'
        },
        {
          id: '000002',
          name: '2'
        },
        {
          id: '000003',
          name: '3'
        },
        {
          id: '000004',
          name: '4'
        },
        {
          id: '000005',
          name: '5'
        },
        {
          id: '000006',
          name: '6'
        }
      ]
    });
  }
};

module.exports = common;
