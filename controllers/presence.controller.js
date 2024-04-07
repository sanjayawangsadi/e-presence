const e = require('express');
const { employees, presences, storePresence, updateStatus, Latestpresences } = require('../repositories/presence.repository.js');
const { validationResult, matchedData } = require('express-validator');
const { DateTime } = require("luxon");

const getEmployees = (async (req, res) => {
    const auth = req.session.auth;

    await employees(auth.npp).then((employees) => {
        return res.status(200).json({
            message: 'Success get data',
            data: employees
        })
    }).catch((e) => {
        return res.status(500).json({
            message: 'Internal Server Error',
            data: null
        })
    })
})

const getPresences = (async (req, res) => {
    const user_id = parseInt(req.params.userId)
    await presences(user_id).then((presences) => {
        let presencesArr = [];

        let inArr = [];
        let outArr = [];

        presences.forEach((element) => {
            if (element.type === "OUT") {
                outArr.push({
                    user_id: element.user_id,
                    name: element.employee.name,
                    type: element.type,
                    is_approve: element.is_approve,
                    date: DateTime.fromJSDate(element.time).toFormat('yyyy-LL-dd'),
                    time: DateTime.fromJSDate(element.time).toFormat('HH:mm:ss')
                })
            } else {
                inArr.push({
                    user_id: element.user_id,
                    name: element.employee.name,
                    type: element.type,
                    is_approve: element.is_approve,
                    date: DateTime.fromJSDate(element.time).toFormat('yyyy-LL-dd'),
                    time: DateTime.fromJSDate(element.time).toFormat('HH:mm:ss')
                })
            }

        });

        for (let i = 0; i < inArr.length; i++) {
            if (outArr[i] !== undefined) {
                presencesArr.push({
                    id_user: inArr[i].user_id,
                    name_user: inArr[i].name,
                    tanggal: inArr[i].date,
                    waktu_masuk: inArr[i].time,
                    status_masuk: inArr[i].is_approve ? 'APPROVED' : 'REJECTED',
                    waktu_pulang: outArr[i].time,
                    status_pulang: outArr[i].is_approve ? 'APPROVED' : 'REJECTED'
                })
            } else {
                if (inArr[i].is_approve === null) {
                    presencesArr.push({
                        id_user: inArr[i].user_id,
                        name_user: inArr[i].name,
                        tanggal: inArr[i].date,
                        waktu_masuk: inArr[i].time,
                        status_masuk: "WAITING",
                        waktu_pulang: null,
                        status_pulang: "WAITING"
                    })
                } else {
                    presencesArr.push({
                        id_user: inArr[i].user_id,
                        name_user: inArr[i].name,
                        tanggal: inArr[i].date,
                        waktu_masuk: inArr[i].time,
                        status_masuk: inArr[i].is_approve ? 'APPROVED' : 'REJECTED',
                        waktu_pulang: null,
                        status_pulang: "WAITING"
                    })
                }
            }
        }

        return res.status(200).json({
            message: 'Success get data',
            data: presencesArr
        })
    }).catch((e) => {
        return res.status(500).json({
            message: e.message,
            data: null
        })
    })
})

const employeePresence = (async (req, res) => {
    const auth = req.session.auth;
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(422).json({
            message: "Validation Error!",
            data: {
                errors: result.array()
            }
        });
    }

    const reqData = matchedData(req)
    await storePresence({
        user_id: auth.user_id,
        type: reqData.type,
        time: new Date(reqData.waktu).toISOString()
    }).then((presence) => {
        return res.status(201).json({
            message: 'Success store presence data',
            data: presence
        })
    }).catch((e) => {
        return res.status(500).json({
            message: 'Internal Server Error',
            data: null
        })
    })

})

const approvePresence = (async (req, res) => {
    // const auth = req.session.auth;
    const result = validationResult(req);
    const presenceId = parseInt(req.params.presenceId)

    if (!result.isEmpty()) {
        return res.status(422).json({
            message: "Validation Error!",
            data: {
                errors: result.array()
            }
        });
    }
    const reqData = matchedData(req)
    await updateStatus(presenceId, reqData.approve)
        .then((status) => {
            return res.status(200).json({
                message: 'Success update presence status',
                data: status
            })
        }).catch((e) => {
            return res.status(500).json({
                message: 'Internal Server Error',
                data: null
            })
        })
})

const employeeApproval = (async (req, res) => {
    const userId = parseInt(req.params.userId)
    await Latestpresences(userId)
        .then((presences) => {
            let presenceData = [];
            presences.forEach((element) => {
                presenceData.push({
                    id_presence: element.id,
                    id_user: element.user_id,
                    nama: element.employee.name,
                    npp: element.npp,
                    type: element.type,
                    status: element.is_approve ? 'APPROVED' : 'REJECTED',
                    tanggal: DateTime.fromJSDate(element.time).toFormat('yyyy-LL-dd'),
                    waktu: DateTime.fromJSDate(element.time).toFormat('HH:mm:ss')
                })
            });
            return res.status(200).json({
                message: 'Success get employee approval requests',
                data: presenceData
            })
        }).catch((e) => {
            return res.status(500).json({
                message: 'Internal Server Error',
                data: null
            })
        })
})


module.exports = {
    getEmployees,
    getPresences,
    employeePresence,
    approvePresence,
    employeeApproval
}