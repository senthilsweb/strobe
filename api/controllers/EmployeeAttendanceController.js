/**
 * EmployeeAttendanceController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    attendanceByDateRange: function (req, res) {
        console.log("get employees by date range")
        var params = req.params.all();
        var employees = [];
        EmployeeAttendance.find({ EmpId: params.EmpId }, function (err, employeeattendance) {
            if (err) {
                return console.log(err);
            } else {
                if (employeeattendance === undefined) {
                    res.send(500, "Retrieveing data failed....")
                } else {
                    employeeattendance.forEach(function (item) {
                        item.AttendanceDate = new Date(item.AttendanceDate);
                    });
                    //var employees = (from i in employeeattendance
                    //where (i.AttendanceDate >= new Date(params.start_date) && i.AttendanceDate <= new Date(params.end_date)) );

                    employeeattendance.forEach(function (item) {
                        item.AttendanceDate = new Date(item.AttendanceDate);
                        if (item.AttendanceDate >= new Date(params.start_date) && item.AttendanceDate <= new Date(params.end_date)) {
                            employees.push(item);
                        }
                    });                    
                    res.send(200, employees);
                }
            }
        });
    }

}