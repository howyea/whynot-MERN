import request from "superagent";
async function login () {
    const {body} = await request.get('https://hrmapi.que360.com/Api/Permission/getAdminPermissionNew', {
        username: '13570264649',
        password: 'yehuiyu152+',
        client_secret: 'ITEHvFFJtiNrmEY3lcDeyMadgFuNGEpD',
        client_id: '100012'
    });
    return body;
}
async function signIn (params) {
    const {body} = await request.post('https://hrmapi.que360.com/Api/AttendanceManage/clockOnAndOff', {
        equipment: 'OPPO R9s-6.0.1(3bd3a8dd)',
        equipment_number: '3bd3a8dd',
        phone_model: 'OPPO R9s',
        operating_system: 'Android Linux6.0.1',
        version: '1.9.1',
        sign_type: '1',
        in_or_out: '2',
        mac_address: 'f0-b4-29-f3-14-e1',
        ...params
        // company_id:	'93',
        // sign_time: '2018-11-22 08:58:58',
// access_token	LwGXk9pqzv6HiOIt5YLYX3fyxaX1me7ltz0CUkzt
// uuid	E0832524-8798-8625-6719-2D334189D81D
    });
    return body;
}
export {
    login,
    signIn
}