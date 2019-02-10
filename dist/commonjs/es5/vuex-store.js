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
                create: async function (_ref, record) {
                    var commit = _ref.commit;

                    var data = await _this.update(function (t) {
                        return t.addRecord(record);
                    });
                    commit("set", { data: record, model: record.type });
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

                    //TODO: singularize
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
                    if (!model.endsWith("Collection")) {
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
                            state[model + 'Collection'].push(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiY3JlYXRlIiwiY29tbWl0IiwiZGF0YSIsInQiLCJyZWNvcmQiLCJmZXRjaEFsbE9mIiwicSIsImZldGNoQWxsUmVsYXRlZE9mIiwicXVlcnkiLCJmZXRjaFJlbGF0ZWRPZiIsImZldGNoT25lIiwiaWQiLCJ0eXBlIiwidXBkYXRlIiwiZGVsZXRlIiwiZGlzcGF0Y2giLCJ1cGRhdGluZyIsIm9wdGlvbnMiLCJxdWVyeWluZyIsInJlbW92ZSIsImluZGV4Iiwic3RhdGUiLCJzZXQiLCJzZXR0ZWQiLCJpdGVtIiwidXBkYXRlRmllbGQiLCJwYXRoIiwidmFsdWUiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCQSxZOzs7QUFDakIsYUFBQSxTQUFBLEdBQTJCO0FBQUEsWUFBZkUsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsU0FBQTs7QUFBQSxZQUFBLFFBQUEsMkJBQUEsSUFBQSxFQUN2QixPQUFBLElBQUEsQ0FBQSxJQUFBLEVBRHVCLFFBQ3ZCLENBRHVCLENBQUE7O0FBRXZCLGNBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFJQSxTQUFKLE1BQUEsRUFBcUI7QUFDakI7QUFDQSxrQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNBQyxtQkFBQUEsSUFBQUEsQ0FBWSxNQUFBLE9BQUEsQ0FBWkEsTUFBQUEsRUFBQUEsT0FBQUEsQ0FBeUMsVUFBQSxJQUFBLEVBQVE7QUFDN0Msb0JBQUlDLFFBQVFGLFNBQUFBLE1BQUFBLENBQUFBLFFBQUFBLENBQVosSUFBWUEs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QSxNQUFBQSxDQUE2QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBNkI7QUFDdEQsNEJBQUlFLE1BQUFBLE1BQUFBLEtBQWlCUixRQUFyQixDQUFBLEVBQWdDO0FBQzVCO0FBQ0FyQixpQ0FBQUEsR0FBQUEsSUFBQUEsS0FBQUE7QUFDSDtBQUNELCtCQUFPQSxLQUFQLEdBQU9BLENBQVA7QUFMSjJCLHFCQUFBQSxFQUFBQSxLQUFBQTtBQU9IO0FBM0NZLGFBQWpCO0FBNkNIO0FBMUhzQixlQUFBLEtBQUE7QUEySDFCOzs7RUE1SGtDaEMsZTs7a0JBQWxCRCxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICAvL3Npbmd1bGFyaXplZFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdHlwZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vYW5kIGEgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbYCR7dHlwZX1Db2xsZWN0aW9uYF0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBhc3luYyAoeyBjb21taXQgfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgdGhpcy51cGRhdGUodCA9PiB0LmFkZFJlY29yZChyZWNvcmQpKTtcbiAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YTogcmVjb3JkLCBtb2RlbDogcmVjb3JkLnR5cGUgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6ICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGAke21vZGVsfUNvbGxlY3Rpb25gIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTsgLy9taW5kIHRoYXQgdGhpcyBpcyB0aGUgcGx1cmFsaXplZCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZChxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7IC8vc2luZ3VsYXJpemVkIHZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogbW9kZWwgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQudXBkYXRlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0aW9ucy50cmFuc2Zvcm1Pck9wZXJhdGlvbnMpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeWluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5xdWVyeU9yRXhwcmVzc2lvbihxKTtcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHJlbW92ZTogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBzaW5ndWxhcml6ZVxuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gc3RhdGVbbW9kZWwgKyAncyddLmZpbmRJbmRleChyZWNvcmQgPT4gcmVjb3JkLmlkID09IGRhdGEuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWwgKyAncyddLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBzdGF0ZVttb2RlbCArICdzJ10uZmluZEluZGV4KHJlY29yZCA9PiByZWNvcmQuaWQgPT0gZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbCArICdzJ10uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZGVsLmVuZHNXaXRoKFwiQ29sbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGUgYWxzbyBpbiBDb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2V0dGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVtgJHttb2RlbH1Db2xsZWN0aW9uYF0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVtgJHttb2RlbH1Db2xsZWN0aW9uYF0ucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BsaWNlIGRhdGEgaW4gb2RlciB0byBhY2hpZXZlIHVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXS5zcGxpY2UoZGF0YS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==