import xlsx from "xlsx";
import { createIcons, icons } from "lucide";
import Tabulator from "tabulator-tables";
import TomSelect from "tom-select";
 
("use strict");
var visaExpiryListTable = (function () {
    var _tableGen = function () {
        // Setup Tabulator

        let tableContent = new Tabulator("#visaExpiryListTable", {
            ajaxURL: route("hr.portal.visa.expiry.list"),
            ajaxParams: {},
            ajaxFiltering: true,
            ajaxSorting: true,
            printAsHtml: true,
            printStyled: true,
            pagination: "remote",
            paginationSize: 10,
            paginationSizeSelector: [true, 5, 10, 20, 30, 40],
            layout: "fitColumns",
            responsiveLayout: "collapse",
            placeholder: "No matching records found",
            columns: [
                {
                    title: "Name",
                    field: "name",
                    headerHozAlign: "left",
                    formatter(cell, formatterParams) { 
                        var html = '<a href="'+cell.getData().url+'" class="flex justify-start items-center">';
                                html += '<div class="w-10 h-10 intro-x image-fit mr-5">';
                                    html += '<img alt="'+cell.getData().name+'" class="rounded-full shadow" src="'+cell.getData().photo_url+'">';
                                html += '</div>';
                                html += '<div>';
                                    html += '<div class="font-medium whitespace-nowrap">'+cell.getData().name+'</div>';
                                    html += '<div class="text-slate-500 text-xs whitespace-nowrap">'+(cell.getData().designation != '' ? cell.getData().designation : 'Unknown')+'</div>';
                                html += '</div>';
                            html += '</a>';
                        return html;
                    }
                },
                {
                    title: "Work Permit Number",
                    field: "workpermit_number",
                    headerHozAlign: "left",
                },
                {
                    title: "Work Permit Exp. Date",
                    field: "workpermit_expire",
                    headerHozAlign: "left",
                },
                {
                    title: "Status",
                    field: "days",
                    hozAlign: "left",
                    headerHozAlign: "left",
                    formatter(cell, formatterParams){
                        var tone = (cell.getData().class || '').indexOf('danger') > -1 ? 'lcc-badge--critical' : 'lcc-badge--warning';
                        return '<span class="lcc-badge '+tone+' has-dot">'+cell.getData().days+(cell.getData().days == 1 ? ' Day' : ' Days')+'</span>';
                    }
                },
                {
                    title: "Actions",
                    field: "id",
                    headerSort: false,
                    hozAlign: "right",
                    headerHozAlign: "right",
                    width: "180",
                    download:false,
                    formatter(cell, formatterParams) {                        
                        var btns = "";

                        btns += '<button data-id="' +cell.getData().id +'" data-tw-toggle="modal" data-tw-target="#sendVisaExpireMailModal" type="button" title="Send reminder email" class="edit_btn inline-flex items-center justify-center w-9 h-9 rounded-lg bg-soft text-soft-text hover:bg-primary hover:text-white transition-colors ml-1"><i data-lucide="mail-check" class="w-4 h-4"></i></button>';
                        btns += '<button data-id="' +cell.getData().id +'" data-tw-toggle="modal" data-tw-target="#viewVisaExpireMailsModal" title="View sent emails" class="delete_btn inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:text-primary hover:border-primary transition-colors ml-1"><i data-lucide="list-ordered" class="w-4 h-4"></i></button>';
                        
                        return btns;
                    },
                },
            ],
            renderComplete() {
                createIcons({
                    icons,
                    "stroke-width": 1.5,
                    nameAttr: "data-lucide",
                });
                const columnLists = this.getColumns();
                if (columnLists.length > 0) {
                    const lastColumn = columnLists[columnLists.length - 1];
                    const currentWidth = lastColumn.getWidth();
                    lastColumn.setWidth(currentWidth - 1);
                }
            },
        });

        // Redraw table onresize
        window.addEventListener("resize", () => {
            tableContent.redraw();
            createIcons({
                icons,
                "stroke-width": 1.5,
                nameAttr: "data-lucide",
            });
        });

        // Print
        $("#tabulator-print").on("click", function (event) {
            tableContent.print();
        });
    };
    return {
        init: function () {
            _tableGen();
        },
    };
})();

(function(){
    if ($("#visaExpiryListTable").length) {
        visaExpiryListTable.init();
    }
})();