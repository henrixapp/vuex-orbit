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
                //singularized
                _this.state[type] = null;
                //and a collection
                _this.state[type + 'Collection'] = [];
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
                        commit("set", { data: record, model: record.type });
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
                        commit('set', { data: data, model: model + 'Collection' });
                    });
                },
                fetchAllRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship }); //mind that this is the pluralized version
                    });
                },
                fetchRelatedOf: function (_ref4, query) {
                    var commit = _ref4.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecord(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship }); //singularized version
                    });
                },
                fetchOne: function (_ref5, _ref6) {
                    var commit = _ref5.commit;
                    var model = _ref6.model,
                        id = _ref6.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: model });
                    });
                },
                update: function (_ref7, data) {
                    var commit = _ref7.commit;

                    _this.update(function (t) {
                        return t.updateRecord(data);
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
                    if (model.endsWith("Collection")) {
                        //update also in Collection
                        var setted = false;
                        state[model + 'Collection'].forEach(function (item) {
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
                        //splice data in oder to achieve updates
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiY3JlYXRlIiwiY29tbWl0IiwiZGlzcGF0Y2giLCJ0IiwiZGF0YSIsInJlY29yZCIsImZldGNoQWxsT2YiLCJxIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJxdWVyeSIsImZldGNoUmVsYXRlZE9mIiwiZmV0Y2hPbmUiLCJpZCIsInR5cGUiLCJ1cGRhdGUiLCJkZWxldGUiLCJ1cGRhdGluZyIsIm9wdGlvbnMiLCJxdWVyeWluZyIsInJlbW92ZSIsImluZGV4Iiwic3RhdGUiLCJzZXQiLCJzZXR0ZWQiLCJpdGVtIiwidXBkYXRlRmllbGQiLCJwYXRoIiwidmFsdWUiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCQSxZOzs7QUFDakIsYUFBQSxTQUFBLEdBQTJCO0FBQUEsWUFBZkUsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsU0FBQTs7QUFBQSxZQUFBLFFBQUEsMkJBQUEsSUFBQSxFQUN2QixPQUFBLElBQUEsQ0FBQSxJQUFBLEVBRHVCLFFBQ3ZCLENBRHVCLENBQUE7O0FBRXZCLGNBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFJQSxTQUFKLE1BQUEsRUFBcUI7QUFDakI7QUFDQSxrQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNBQyxtQkFBQUEsSUFBQUEsQ0FBWSxNQUFBLE9BQUEsQ0FBWkEsTUFBQUEsRUFBQUEsT0FBQUEsQ0FBeUMsVUFBQSxJQUFBLEVBQVE7QUFDN0Msb0JBQUlDLFFBQVFGLFNBQUFBLE1BQUFBLENBQUFBLFFBQUFBLENBQVosSUFBWUEs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QUFrQjtBQUFBLHdCQUFaQyxRQUFZLE9BQVpBLEtBQVk7O0FBQ3JDO0FBQ0FELHlCQUFBQSxLQUFBQSxDQUFBQSxTQUFBQSxFQUFBQSxNQUFBQSxDQUE2QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBNkI7QUFDdEQsNEJBQUlFLE1BQUFBLE1BQUFBLEtBQWlCUixRQUFyQixDQUFBLEVBQWdDO0FBQzVCO0FBQ0FyQixpQ0FBQUEsR0FBQUEsSUFBQUEsS0FBQUE7QUFDSDtBQUNELCtCQUFPQSxLQUFQLEdBQU9BLENBQVA7QUFMSjJCLHFCQUFBQSxFQUFBQSxLQUFBQTtBQU9IO0FBMUNZLGFBQWpCO0FBNENIO0FBNUhzQixlQUFBLEtBQUE7QUE2SDFCOzs7RUE5SGtDaEMsZTs7a0JBQWxCRCxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICAvL3Npbmd1bGFyaXplZFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdHlwZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vYW5kIGEgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbYCR7dHlwZX1Db2xsZWN0aW9uYF0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQuYWRkUmVjb3JkKHJlY29yZCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgcmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YTogcmVjb3JkLCBtb2RlbDogcmVjb3JkLnR5cGUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHJlbGF0aW9uc2hpcHMgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBgJHttb2RlbH1Db2xsZWN0aW9uYCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaEFsbFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkcyhxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7IC8vbWluZCB0aGF0IHRoaXMgaXMgdGhlIHBsdXJhbGl6ZWQgdmVyc2lvblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pOyAvL3Npbmd1bGFyaXplZCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hPbmU6ICh7IGNvbW1pdCB9LCB7IG1vZGVsLCBpZCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmQoeyB0eXBlOiBtb2RlbCwgaWQgfSkpLnRoZW4oZGF0YSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IG1vZGVsIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogKHsgY29tbWl0IH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnVwZGF0ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVtb3ZlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgZGF0YS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdGlvbnMudHJhbnNmb3JtT3JPcGVyYXRpb25zKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcXVlcnlpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMucXVlcnlPckV4cHJlc3Npb24ocSk7XG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vVE9ETzogUmVsYXRlZFJlY29yZHMgdXBkYXRlIGFuZCBkZWxldGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm11dGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICByZW1vdmU6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5sYXN0SW5kZXhPZigncycpICE9PSBtb2RlbC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBzdGF0ZVttb2RlbCArICdzJ10uZmluZEluZGV4KHJlY29yZCA9PiByZWNvcmQuaWQgPT0gZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbCArICdzJ10uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHN0YXRlW21vZGVsICsgJ3MnXS5maW5kSW5kZXgocmVjb3JkID0+IHJlY29yZC5pZCA9PSBkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsICsgJ3MnXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5lbmRzV2l0aChcIkNvbGxlY3Rpb25cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIGFsc28gaW4gQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbYCR7bW9kZWx9Q29sbGVjdGlvbmBdLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gZGF0YS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbGF0aW9uc2hpcHMgPSBkYXRhLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ua2V5cyA9IGRhdGEua2V5cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0ucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BsaWNlIGRhdGEgaW4gb2RlciB0byBhY2hpZXZlIHVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXS5zcGxpY2UoZGF0YS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==