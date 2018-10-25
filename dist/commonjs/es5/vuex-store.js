"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require("@orbit/store");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
}

var VuexStore = function (_Store) {
    _inherits(VuexStore, _Store);

    function VuexStore() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VuexStore);

        var _this = _possibleConstructorReturn(this, _Store.call(this, settings));

        _this.namespaced = false;
        if (settings.schema) {
            //generate vuex store
            _this.state = _this.state || {};
            Object.keys(_this._schema.models).forEach(function (type) {
                var model = settings.schema.getModel(type);
                _this.state = _this.state || {};
                //add to state
                _this.state[_this._schema.singularize(type)] = null;
                _this.state[_this._schema.pluralize(type)] = [];
            });
            //map fields
            _this.getters = {
                getField: function (state) {
                    return function (path) {
                        return path.split(/[.[\]]+/).reduce(function (prev, key) {
                            if (prev != null) {
                                return prev[key];
                            } else {
                                return null;
                            }
                        }, state);
                    };
                }
            };
            _this.actions = {
                //TODO: Add fetch settings like json api
                create: function (_ref, record) {
                    var commit = _ref.commit,
                        dispatch = _ref.dispatch;

                    _this.update(function (t) {
                        return t.addRecord(record);
                    }).then(function (data) {
                        // dispatch("fetchAllOf", record.type);
                        commit("set", { data: record, model: _this._schema.singularize(record.type) });
                        //TODO: relationships 
                    });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: function (_ref2, model) {
                    var commit = _ref2.commit;

                    _this.query(function (q) {
                        return q.findRecords(model);
                    }).then(function (data) {
                        commit('set', { data: data, model: _this._schema.pluralize(model) });
                    });
                },
                fetchAllRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchRelatedOf: function (_ref4, query) {
                    var commit = _ref4.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecord(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchOne: function (_ref5, _ref6) {
                    var commit = _ref5.commit;
                    var model = _ref6.model,
                        id = _ref6.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: _this._schema.singularize(model) });
                    });
                },
                update: function (_ref7, data) {
                    var commit = _ref7.commit;

                    _this.update(function (t) {
                        return t.replaceRecord(data);
                    }).then(function () {
                        return commit('set', { data: data, model: data.type });
                    });
                },
                delete: function (_ref8, data) {
                    var commit = _ref8.commit,
                        dispatch = _ref8.dispatch;

                    _this.update(function (t) {
                        return t.removeRecord(data);
                    }).then(function () {
                        //update
                        dispatch("fetchAllOf", data.type);
                    });
                },
                updating: function (store, options) {
                    _this.update(options.transformOrOperations).then(function (data) {
                        options.thenable(store, data);
                    });
                },
                querying: function (store, options) {
                    _this.query(function (q) {
                        return options.queryOrExpression(q);
                    }).then(function (data) {
                        options.thenable(store, data);
                    });
                }
                //TODO: RelatedRecords update and delete
            };
            _this.mutations = {
                remove: function (state, _ref9) {
                    var data = _ref9.data,
                        model = _ref9.model;

                    if (model.lastIndexOf('s') !== model.length - 1) {
                        var index = state[model + 's'].findIndex(function (record) {
                            return record.id == data.id;
                        });
                        state[model + 's'].splice(index, 1);
                    } else {
                        var _index = state[model + 's'].findIndex(function (record) {
                            return record.id == data.id;
                        });
                        state[model + 's'].splice(_index, 1);
                    }
                },
                set: function (state, _ref10) {
                    var data = _ref10.data,
                        model = _ref10.model;

                    state[model] = data;
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        var setted = false;
                        state[_this.schema.pluralize(model)].forEach(function (item) {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                                setted = true;
                            }
                        });
                        if (!setted) {
                            state[_this.schema.pluralize(model)].push(data);
                        }
                    } else {
                        state[model] = [];
                        state[model] = data;
                        state[model].splice(data.length);
                    }
                },
                updateField: function (state, _ref11) {
                    var path = _ref11.path,
                        value = _ref11.value;

                    //set in field
                    path.split(/[.[\]]+/).reduce(function (prev, key, index, array) {
                        if (array.length === index + 1) {
                            // eslint-disable-next-line no-param-reassign
                            prev[key] = value;
                        }
                        return prev[key];
                    }, state);
                }
            };
        }
        return _this;
    }

    return VuexStore;
}(_store2.default);

exports.default = VuexStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiY3JlYXRlIiwiY29tbWl0IiwiZGlzcGF0Y2giLCJ0IiwiZGF0YSIsInJlY29yZCIsImZldGNoQWxsT2YiLCJxIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJxdWVyeSIsImZldGNoUmVsYXRlZE9mIiwiZmV0Y2hPbmUiLCJpZCIsInR5cGUiLCJ1cGRhdGUiLCJkZWxldGUiLCJ1cGRhdGluZyIsIm9wdGlvbnMiLCJxdWVyeWluZyIsInJlbW92ZSIsImluZGV4Iiwic3RhdGUiLCJzZXQiLCJzZXR0ZWQiLCJpdGVtIiwidXBkYXRlRmllbGQiLCJwYXRoIiwidmFsdWUiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCQSxZOzs7QUFDakIsYUFBQSxTQUFBLEdBQTJCO0FBQUEsWUFBZkUsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsU0FBQTs7QUFBQSxZQUFBLFFBQUEsMkJBQUEsSUFBQSxFQUN2QixPQUFBLElBQUEsQ0FBQSxJQUFBLEVBRHVCLFFBQ3ZCLENBRHVCLENBQUE7O0FBRXZCLGNBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFJQSxTQUFKLE1BQUEsRUFBcUI7QUFDakI7QUFDQSxrQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNBQyxtQkFBQUEsSUFBQUEsQ0FBWSxNQUFBLE9BQUEsQ0FBWkEsTUFBQUEsRUFBQUEsT0FBQUEsQ0FBeUMsVUFBQSxJQUFBLEVBQVE7QUFDN0Msb0JBQUlDLFFBQVFGLFNBQUFBLE1BQUFBLENBQUFBLFFBQUFBLENBQVosSUFBWUEs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QUFBQSxJQUFBQTtBQUNBQSw4QkFBQUEsS0FBQUEsRUFBQUEsTUFBQUEsQ0FBb0JqQixLQUFwQmlCLE1BQUFBO0FBQ0g7QUE3QlEsaUJBQUE7QUErQmJJLDZCQUFhLFVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBNEI7QUFBQSx3QkFBbEJDLE9BQWtCLE9BQWxCQSxJQUFrQjtBQUFBLHdCQUFaQyxRQUFZLE9BQVpBLEtBQVk7O0FBQ3JDO0FBQ0FELHlCQUFBQSxLQUFBQSxDQUFBQSxTQUFBQSxFQUFBQSxNQUFBQSxDQUE2QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBNkI7QUFDdEQsNEJBQUlFLE1BQUFBLE1BQUFBLEtBQWlCUixRQUFyQixDQUFBLEVBQWdDO0FBQzVCO0FBQ0FyQixpQ0FBQUEsR0FBQUEsSUFBQUEsS0FBQUE7QUFDSDtBQUNELCtCQUFPQSxLQUFQLEdBQU9BLENBQVA7QUFMSjJCLHFCQUFBQSxFQUFBQSxLQUFBQTtBQU9IO0FBeENZLGFBQWpCO0FBMENIO0FBeEhzQixlQUFBLEtBQUE7QUF5SDFCOzs7RUExSGtDaEMsZTs7a0JBQWxCRCxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZSh0eXBlKV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQuYWRkUmVjb3JkKHJlY29yZCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgcmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YTogcmVjb3JkLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHJlY29yZC50eXBlKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogcmVsYXRpb25zaGlwcyBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6ICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5wbHVyYWxpemUobW9kZWwpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKG1vZGVsKSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGU6ICh7IGNvbW1pdCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZXBsYWNlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0aW9ucy50cmFuc2Zvcm1Pck9wZXJhdGlvbnMpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeWluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5xdWVyeU9yRXhwcmVzc2lvbihxKTtcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHJlbW92ZTogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmxhc3RJbmRleE9mKCdzJykgIT09IG1vZGVsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHN0YXRlW21vZGVsICsgJ3MnXS5maW5kSW5kZXgocmVjb3JkID0+IHJlY29yZC5pZCA9PSBkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsICsgJ3MnXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gc3RhdGVbbW9kZWwgKyAncyddLmZpbmRJbmRleChyZWNvcmQgPT4gcmVjb3JkLmlkID09IGRhdGEuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWwgKyAncyddLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldDogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmxhc3RJbmRleE9mKCdzJykgIT09IG1vZGVsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW3RoaXMuc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCldLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gZGF0YS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbGF0aW9uc2hpcHMgPSBkYXRhLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ua2V5cyA9IGRhdGEua2V5cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0ucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXS5zcGxpY2UoZGF0YS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==