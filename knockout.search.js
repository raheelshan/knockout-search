// Knockout Database plugin v1.0
// (c) 2014 Muhammad Raheel - 
(function (e) {
    "function" === typeof require && "object" === typeof exports && "object" === typeof module ? e(require("knockout"), exports) : "function" === typeof define && define.amd ? define(["knockout", "exports"], e) : e(ko, ko.search = {})
})
(function (e, f) {
    //console.log(e)
    ko.search = {
        _data: [],
        _tempData: [],
        _removeData: [],
        _isJson: false,
        _query: new Array(5),
        _resortResult: false,
        _sortFilter: '',
        _callbackFlag: false,
        _callback: null,
        _dataType: '',
        /*  Private Functions */
        _isJson: function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },

        _reset: function () {
            this._tempData = this._data
            this._removeData = []
            this._resortResult = false
        },

        _search: function (params, data) {

            var reverse_resuls = []
            var results = ko.utils.arrayFilter(data, function (item) {
                for (var prop in params) {
                    if (params.hasOwnProperty(prop)) {
                        var checkValue = ko.unwrap(item[prop])

                        if (typeof (params[prop]) == 'number' || typeof (params[prop]) == 'string') {
                            if (checkValue !== params[prop]) {
                                reverse_resuls.push(item)
                                return false;
                            }
                        } else if (params[prop] instanceof Array) {
                            if (params[prop].indexOf(checkValue) == -1) {
                                reverse_resuls.push(item)
                                return false;
                            }
                        } else {
                            var check = params[prop]
                            var r = false
                            switch (check.condition) {
                                case '==':
                                    r = (checkValue == check.value)
                                    break;
                                case '!=':
                                    r = (checkValue != check.value)
                                    break;
                                case '===':
                                    r = (checkValue === check.value)
                                    break;
                                case '!==':
                                    r = (checkValue !== check.value)
                                    break;
                                case '<':
                                    r = (checkValue < check.value)
                                    break;
                                case '>':
                                    r = (checkValue > check.value)
                                    break;
                                case '<=':
                                    r = (checkValue <= check.value)
                                    break;
                                case '>=':
                                    r = (checkValue >= check.value)
                                    break;
                                default:
                                    break;
                            }
                            if (!r) {
                                reverse_resuls.push(item)
                            }
                            return r;
                        }
                    }
                }

                return true;
            });
            this._removeData = reverse_resuls
            return results
        },

        _sort: function (key, reverse) {
            var moveSmaller = reverse ? 1 : -1;
            var moveLarger = reverse ? -1 : 1;
            return function (a, b) {
                if (a[key] < b[key]) {
                    return moveSmaller;
                }

                if (a[key] > b[key]) {
                    return moveLarger;
                }
                return 0;
            };
        },

        _resort: function (return_data, key, reverse) {
            var count = 0;
            var firstSortValue = return_data[count][this._sortFilter];
            for (var i = count + 1; i < return_data.length; i++) {
                if (return_data[i][this._sortFilter] !== firstSortValue) {
                    var data = return_data.slice(count, i);
                    data = data.sort(this._sort(key, reverse))
                    var argsArray = [count, i - count];
                    argsArray.push.apply(argsArray, data);
                    Array.prototype.splice.apply(return_data, argsArray);
                    count = i;
                    firstSortValue = return_data[i][this._sortFilter];
                }
            }
            return return_data
        },

        _runCallback: function () {
            if (this._callbackFlag) {
                this._callback.call()
                this._callbackFlag = false
            }
        },

        _LoadData: function (data) {
            this._data = data
            if (this._isJson(this._data)) {
                this._isJson = true
                this._dataType = 'JSON String '
                this._tempData = JSON.parse(this._data)
            } else if (this._data instanceof Array || typeof (this._data) == 'object') {
                this._tempData = this._data
                this._dataType = 'Array'
            } else {
                console.log('Invalid data provided')
            }
            this._query[0] = { prop: 'Query Log', value: 'Generated Query Result', Active: true }
            this._query[1] = { prop: 'Columns', value: '*', Active: true }
            this._query[2] = { prop: 'From', value: this._dataType, Active: true }
            return this
        },
        /*  Query Functions */
        select: function (columns) {
            if (columns instanceof Array) {
                var query = ''
                query += implode(' , ', columns)
                var columnized_data = []
                var return_data = this._tempData
                ko.utils.arrayForEach(return_data, function (item) {
                    var data = {}
                    ko.utils.arrayForEach(columns, function (column) {
                        if (item[column]) {
                            data[column] = item[column]
                        }
                    })
                    columnized_data.push(data)
                })
                this._query[1] = { prop: 'Columns', value: query, Active: true }
                this._tempData = columnized_data
            } else {
                console.log('Please select columns in array format')
            }
            return this
        },

        filter: function (params) {

            var return_data = this._tempData
            var results = []
            if (params instanceof Array) {
                results = return_data.reduce(function (prev, current, index, array) {
                    return prev.concat(this._search(current, return_data));
                }, []);
            } else {
                results = this._search(params, return_data)
            }
            this._tempData = results
            //this._query.push({ prop: 'WHERE', value: '', Active: true })
            return this
        },

        limit: function (limit) {
            var data = this._tempData.slice(0, limit)
            this._query.push({ prop: 'Limit', value: limit, Active: true })
            this._tempData = data
            return this
        },

        start: function (start) {
            var data = this._tempData.slice(start)
            this._query.push({ prop: 'Start', value: start, Active: true })
            this._tempData = data
            return this
        },

        count: function () {
            var data = ko.mapping.toJS(this._tempData)
            this._query.push({ prop: 'Total', value: data.length, Active: true })
            return data.length
        },

        first: function (flag) {
            var return_data = this._tempData
            if (flag) {
                this._tempData = return_data.slice(0, 1)
            } else {
                this._tempData = return_data[0]
            }
            this._query.push({ prop: 'First', value: 1, Active: true })
            return this
        },

        last: function (flag) {
            var return_data = this._tempData
            var length = this._tempData.length
            if (flag) {
                this._tempData = return_data.slice(length - 1)

            } else {
                this._tempData = return_data[length - 1]
            }
            this._query.push({ prop: 'Last', value: 1, Active: true })
            return this
        },

        order: function (key, reverse) {
            var return_data = this._tempData
            reverse = (reverse) ? true : false
            if (this._resortResult) {
                return_data = this._resort(return_data, key, reverse)
            } else {
                return_data.sort(this._sort(key, reverse))
            }
            this._sortFilter = key
            this._resortResult = true
            this._tempData = return_data
            this._query.push({ prop: 'Order', value: key, Active: true })
            this._query.push({ prop: 'Order Reverse', value: reverse, Active: true })
            return this
        },

        max: function (prop) {
            var return_data = this._tempData
            var temp_data = []
            var values = return_data.map(function (el) {
                return ko.unwrap(el[prop]);
            });
            var max = Math.max.apply(Math, values);
            var result = []
            return_data.map(function (el) {
                if (max == ko.unwrap(el[prop])) {
                    temp_data.push(el)
                }
            });
            this._tempData = temp_data
            if (temp_data.length == 1) {
                this._tempData = temp_data[0]
            }
            this._query.push({ prop: 'Max', value: prop, Active: true })
            return this
        },

        min: function (prop) {
            var return_data = this._tempData
            var temp_data = []
            var values = return_data.map(function (el) {
                return ko.unwrap(el[prop]);
            });
            var min = Math.min.apply(Math, values);
            var result = []

            return_data.map(function (el) {
                if (min == ko.unwrap(el[prop])) {
                    temp_data.push(el)
                }
            });
            this._tempData = temp_data
            if (temp_data.length == 1) {
                this._tempData = temp_data[0]
            }
            this._query.push({ prop: 'Min', value: prop, Active: true })
            return this
        },

        index: function (number) {
            var return_data = this._tempData
            if (return_data.length >= number) {
                if (return_data && return_data[number - 1]) {
                    this._tempData = return_data[number - 1]
                }
                this._query.push({ prop: 'Max/Min Record', value: number, Active: true })
            } else {
                console.log('Invalid index provided')
            }
            return this
        },

        remove: function () {
            this._tempData = _removeData
            return this
        },

        query: function () {
            ko.utils.arrayForEach(this._query, function (item) {
                if (item && item.Active) {
                    console.log(item.prop + ' : ' + item.value)
                }
            })
        },
        /*  Funcations Applying */
        callback: function (x) {
            this._callback = x
            this._callbackFlag = true
            return this
        },

        map: function (x) {
            var return_data = this._tempData
            return_data.map(x)
            this._tempData = return_data
            return this
        },

        each: function (x) {
            var return_data = this._tempData
            x.forEach(function (func) {
                return_data.map(func)
            });

            this._tempData = return_data
            return this
        },

        supplant: function (template) {
            var return_data = this._tempData
            return_data.map(function (item) {
                item.template = template.replace(/{(\w+)}/g, function (_, k) {
                    return item[k];
                });
            })
            this._tempData = return_data
            return this
        },
        /*  Setting and Getting */
        userData: function () {
            return this._tempData
        },

        setData: function (data) {
            return this._LoadData(data)
        },

        /*  Result Functions */
        get: function (flag) {
            var return_data = this._tempData
            this._runCallback()
            this._reset()
            if (flag) {
                return ko.mapping.toJS(return_data)
            }
            return return_data
        },

        stringify: function () {
            var return_data = this._tempData
            this._runCallback()
            this._reset()
            return JSON.stringify(ko.mapping.toJS(return_data))
            //return JSON.stringify(ko.mapping.toJS(return_data), null, 4)
        },
    }
})

function implode(glue, pieces) {
    //  discuss at: http://phpjs.org/functions/implode/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Waldo Malqui Silva
    // improved by: Itsacon (http://www.itsacon.net/)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'});
    //   returns 2: 'Kevin van Zonneveld'

    var i = '',
      retVal = '',
      tGlue = '';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }
    if (typeof pieces === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue);
        }
        for (i in pieces) {
            retVal += tGlue + pieces[i];
            tGlue = glue;
        }
        return retVal;
    }
    return pieces;
}
