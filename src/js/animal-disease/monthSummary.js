/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/report/month/summary": "monthSummary"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.monthSummary = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="month_summary_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/report/month/summary",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "templateName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            showContentType: false,
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "报表名称",
                    field: "templateName"
                }, {
                    title: "上级机构",
                    field: "orgName"
                }, {
                    title: "报表周期",
                    field: "reportPeriod"
                }, {
                    title: "上报时间",
                    field: "reportTime"
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "查看",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "report_summary_modal",
                            height: 450,
                            width: 1200,
                            title: "查看",
                            destroy: true,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '保存到本地',
                                    cls: "btn-info",
                                    handle: function () {
                                        App.download("/api/animal/excel/downloadSummary?templateId="
                                            + data.templateId+"&beginTime="+data.beginTime)
                                    }
                                }, {
                                    type: 'button',
                                    text: '关闭',
                                    cls: "btn-default",
                                    handle: function () {
                                        modal.hide()
                                    }
                                }
                            ]
                        })
                        var requestUrl = App.href + "/api/animal/excel/summary"
                        $.ajax({
                            type: "GET",
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
                            dataType: "json",
                            url: requestUrl,
                            data: {
                                templateId: data.templateId,
                                beginTime: data.beginTime
                            },
                            success: function (data) {
                                if (data.code === 200) {
                                    modal.show()
                                    modal.content(data.data.html);
                                } else {
                                    alert(data.message)
                                    modal.hide()
                                }
                            },
                            error: function (e) {
                                alert("请求异常。")
                            }
                        });
                    }
                }
            ],
            search: {
                rowEleNum: 3,
                //搜索栏元素
                items: [
                    {
                        type: "select",
                        id: "templateId",
                        label: "报表名称",
                        name: "templateId",
                        itemsUrl: App.href + "/api/animal/template/options?reportType=3&animal_disease_token=" + App.token
                    }, {
                        type: "html",
                        label: "报表所属时间段",
                        eleHandle: function () {
                            var p = $('<p></p>')

                            var ele = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                '</select>')
                            var date = new Date;
                            var year = date.getFullYear();
                            for (var i = year; i > 2008; i--) {
                                var op = '<option value=' + i + '>' + i + '</option>'
                                ele.append(op)
                            }
                            p.append(ele)
                            p.append('<p style="float: left">年</p>')
                            var ele2 = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                '<option value=1>1</option>' +
                                '<option value=2>2</option>' +
                                '<option value=3>3</option>' +
                                '<option value=4>4</option>' +
                                '<option value=5>5</option>' +
                                '<option value=6>6</option>' +
                                '<option value=7>7</option>' +
                                '<option value=8>8</option>' +
                                '<option value=9>9</option>' +
                                '<option value=10>10</option>' +
                                '<option value=11>11</option>' +
                                '<option value=12>12</option>' +
                                '</select>')
                            p.append(ele2)
                            var month = date.getMonth() + 1
                            ele2.val(month)
                            p.append('<p style="float: left">月</p>')
                            return p
                        }
                    }
                ]
            }
        }
        grid = window.App.content.find("#month_summary_grid").orangeGrid(options)
    }
})(jQuery, window, document)
