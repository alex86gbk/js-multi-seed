const common = {
    getGrades: function (req, res, next) {
        res.send({
            returnEntity: [
                {
                    id: '000001',
                    name: '一年级'
                },
                {
                    id: '000002',
                    name: '二年级'
                }
            ]
        });
    },
    getCourses: function (req, res, next) {
        res.send({
            returnEntity: [
                {
                    id: '000001',
                    name: '数学'
                },
                {
                    id: '000002',
                    name: '语文'
                }
            ]
        });
    }
};

module.exports = common;
