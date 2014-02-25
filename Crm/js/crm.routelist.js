var docId = null;
var korId = null;
var docDateBgn = null;

$().ready(function () {
    var routeListWrapper = new RouteListWrapper();
    routeListWrapper.init2();
});

function RouteListWrapper() {
    var _this = this;

    //empId = $("#empId").val();
    this.curDate = new Date();
    this.curDate.setHours(0, 0, 0, 0);
    this.grid = null;
    this.editWnd = null;
    
    this.init2 = function(){
        _this.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    type: "POST",
                    //url: serverName + "Home/Test?empId=128",
                    //url: serverName + "Home/GetRouteList?empId=77871&curDate=02/25/2014",
                    url: serverName + "Home/GetRouteList",
                    dataType: "json",
                    data: function () { return { empId: empId, curDate: date2Str(_this.curDate)} }
                }
            },
            change: function(e) {
                var view = this.view();
                //alert("view.length=" + view.length + (view.length > 0 ? "; view[0]=" + view[0] : ""));
                alert("view.length=" + view.length + (view.length > 0 ? "; view[0].NAME=" + view[0].NAME : ""));
            }
        });
        $("#routeRefreshButton").kendoMobileButton({
            click: function (e) { _this.dataSource.read(); }
        });
        _this.dataSource.read();
    }
    
    this.init = function () {
        /*$("#routeDatepicker").kendoDatePicker({
            parseFormats: ["dd/MM/yyyy", "dd/MM/yy", "dd.MM.yy"],
            value: _this.curDate,
            change: function () {
                if (this.value() != null) {
                    _this.curDate = this.value();
                    //_this.grid.dataSource.read();
                }
            }
        });*/

        /*$("#routeAddButton").kendoButton({
            //spriteCssClass: "k-icon k-pencil"
            icon: "plus",
            click: function (e) { _this.edit("edit"); }
        });*/
        $("#routeEditButton").kendoMobileButton({
            //spriteCssClass: "k-icon k-pencil"
            icon: "compose",
            click: function (e) { /*_this.edit("edit");*/ }
        });
        $("#routeAddUnscheduledButton").kendoMobileButton({
            icon: "add",
            click: function (e) { /*_this.edit("add");*/ }
        });
        $("#routeRefreshButton").kendoMobileButton({
            click: function (e) { _this.grid.dataSource.read(); }
        });

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    //async: false,
                    type: "POST",
                    url: serverName + "Home/GetRouteList",
                    dataType: "json",
                    data: function () { return { empId: empId, curDate: date2Str(_this.curDate)} }
                }
            }/*,
            requestStart: function () {
                kendo.ui.progress($("#routeGrid"), true);
            },
            requestEnd: function () {
                kendo.ui.progress($("#routeGrid"), false);
            }*/
        });
        var visitTemplate = kendo.template('#switch (VISIT_TYPE) { case 1:# <img src="/Content/images/RouteVisitNot.png" /> #; break; '
            + 'case 2:# <img src="/Content/images/RouteVisitPlan.png" /> #; break; '
            + 'case 3:# <img src="/Content/images/RouteVisitPlanNot.png" /> #; break; default:# sd #; break }#'
        );
        _this.grid = $("#routeGrid").kendoGrid({
            dataSource: dataSource,
            height: "24em",
            navigatable: true,
            selectable: "row",
            sortable: true,
            columns: [{
                field: "EMP_ID",
                hidden: true
            }, {
                field: "CUST_ID",
                hidden: true
            }, {
                field: "VISIT_TYPE",
                title: "Visit",
                //template: visitTemplate,
                width: "40px"
            }, {
                field: "NAME",
                title: "Name",
                width: "30%"
            }, {
                field: "REGION_NAME",
                title: "Region"
            }, {
                field: "CITY_NAME",
                title: "City"
            }, {
                field: "ADDR",
                title: "Address"
            }, {
                field: "TEL",
                title: "Phone"
            }]
        }).data("kendoGrid");
        alert(dataSource.data().length);
    }

    this.edit = function (editType) {
        // editType: "add", "edit"

        docDateBgn = _this.curDate;
        if (editType == "add") {
            docId = -1;
            korId = -1;
        } else {
            if (_this.grid.select().length == 1) {
                docId = _this.grid.dataItem(_this.grid.select()).DOC_ID;
                if (docId == null) { docId = -1 };
                korId = _this.grid.dataItem(_this.grid.select()).CUST_ID;
                if (korId == null) { korId = -1 };
            } else {
                return;
            };
        };

        if (_this.editWnd == null) {
            _this.editWnd = $("#routeEditWindow").kendoWindow({
                title: "Visit",
                content: "/Content/web/RouteListEdit.html",
                actions: [],
                draggable: false,
                modal: true,
                resizable: false,
                visible: false,
                close: function (e) {
                    //alert(e.toString());
                },
                error: function (e) {
                    alert("ERROR: " + e.xhr.responseText);
                }
            }).data("kendoWindow");
        } else {
            _this.editWnd.refresh();
        };
        _this.editWnd.center().open();
    }

    this.del = function () {
    }
};

