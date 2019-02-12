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
                    commit("set", { data: data, model: data.type });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: async function (_ref2, model) {
                    var commit = _ref2.commit;

                    var data = await _this.query(function (q) {
                        return q.findRecords(model);
                    });
                    commit('set', { data: data, model: model + 'Collection' });
                },
                fetchAllRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: _this.schema.singularize(query.relationship) + 'Collection' }); //mind that this is the pluralized version
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
                update: async function (_ref7, record) {
                    var commit = _ref7.commit;

                    var data = await _this.update(function (t) {
                        return t.updateRecord(record);
                    });
                    commit('set', { data: data, model: data.type });
                },
                delete: async function (_ref8, data) {
                    var commit = _ref8.commit,
                        dispatch = _ref8.dispatch;

                    await _this.update(function (t) {
                        return t.removeRecord(data);
                    });
                    await dispatch("fetchAllOf", data.type);
                    commit('set', { data: null, model: data.type });
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
                set: function (state, _ref9) {
                    var data = _ref9.data,
                        model = _ref9.model;

                    state[model] = data;
                    if (data === null) {
                        return;
                    }
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
                updateField: function (state, _ref10) {
                    var path = _ref10.path,
                        value = _ref10.value;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiY3JlYXRlIiwiY29tbWl0IiwiZGF0YSIsInQiLCJmZXRjaEFsbE9mIiwicSIsImZldGNoQWxsUmVsYXRlZE9mIiwicXVlcnkiLCJmZXRjaFJlbGF0ZWRPZiIsImZldGNoT25lIiwiaWQiLCJ0eXBlIiwidXBkYXRlIiwiZGVsZXRlIiwiZGlzcGF0Y2giLCJ1cGRhdGluZyIsIm9wdGlvbnMiLCJxdWVyeWluZyIsInNldCIsInN0YXRlIiwic2V0dGVkIiwiaXRlbSIsInVwZGF0ZUZpZWxkIiwicGF0aCIsInZhbHVlIiwiYXJyYXkiLCJpbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCQSxZOzs7QUFDakIsYUFBQSxTQUFBLEdBQTJCO0FBQUEsWUFBZkUsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsU0FBQTs7QUFBQSxZQUFBLFFBQUEsMkJBQUEsSUFBQSxFQUN2QixPQUFBLElBQUEsQ0FBQSxJQUFBLEVBRHVCLFFBQ3ZCLENBRHVCLENBQUE7O0FBRXZCLGNBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFJQSxTQUFKLE1BQUEsRUFBcUI7QUFDakI7QUFDQSxrQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNBQyxtQkFBQUEsSUFBQUEsQ0FBWSxNQUFBLE9BQUEsQ0FBWkEsTUFBQUEsRUFBQUEsT0FBQUEsQ0FBeUMsVUFBQSxJQUFBLEVBQVE7QUFDN0Msb0JBQUlDLFFBQVFGLFNBQUFBLE1BQUFBLENBQUFBLFFBQUFBLENBQVosSUFBWUEsQ0FBWjtBQUNBLHNCQUFBLEtB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QUFOTEQseUJBQUFBO0FBUUEsNEJBQUksQ0FBSixNQUFBLEVBQWE7QUFDVEEsa0NBQUFBLFFBQUFBLFlBQUFBLEVBQUFBLElBQUFBLENBQUFBLElBQUFBO0FBQ0g7QUFiTCxxQkFBQSxNQWNPO0FBQ0g7QUFDQUEsOEJBQUFBLEtBQUFBLElBQUFBLEVBQUFBO0FBQ0FBLDhCQUFBQSxLQUFBQSxJQUFBQSxJQUFBQTtBQUNBQSw4QkFBQUEsS0FBQUEsRUFBQUEsTUFBQUEsQ0FBb0JqQixLQUFwQmlCLE1BQUFBO0FBQ0g7QUF6QlEsaUJBQUE7QUEyQmJHLDZCQUFhLFVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBNEI7QUFBQSx3QkFBbEJDLE9BQWtCLE9BQWxCQSxJQUFrQjtBQUFBLHdCQUFaQyxRQUFZLE9BQVpBLEtBQVk7O0FBQ3JDO0FBQ0FELHlCQUFBQSxLQUFBQSxDQUFBQSxTQUFBQSxFQUFBQSxNQUFBQSxDQUE2QixVQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBNkI7QUFDdEQsNEJBQUlFLE1BQUFBLE1BQUFBLEtBQWlCQyxRQUFyQixDQUFBLEVBQWdDO0FBQzVCO0FBQ0EzQixpQ0FBQUEsR0FBQUEsSUFBQUEsS0FBQUE7QUFDSDtBQUNELCtCQUFPQSxLQUFQLEdBQU9BLENBQVA7QUFMSndCLHFCQUFBQSxFQUFBQSxLQUFBQTtBQU9IO0FBcENZLGFBQWpCO0FBc0NIO0FBbEhzQixlQUFBLEtBQUE7QUFtSDFCOzs7RUFwSGtDN0IsZTs7a0JBQWxCRCxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICAvL3Npbmd1bGFyaXplZFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdHlwZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vYW5kIGEgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbYCR7dHlwZX1Db2xsZWN0aW9uYF0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBhc3luYyAoeyBjb21taXQgfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgdGhpcy51cGRhdGUodCA9PiB0LmFkZFJlY29yZChyZWNvcmQpKTtcbiAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBhcmd1bWVudCBtb2RlbDogVGhlIG1vZGVsIGFzIHNpbmd1bGFyaXplZCBuYW1lXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxPZjogYXN5bmMgKHsgY29tbWl0IH0sIG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKTtcbiAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBgJHttb2RlbH1Db2xsZWN0aW9uYCB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGAke3RoaXMuc2NoZW1hLnNpbmd1bGFyaXplKHF1ZXJ5LnJlbGF0aW9uc2hpcCl9Q29sbGVjdGlvbmAgfSk7IC8vbWluZCB0aGF0IHRoaXMgaXMgdGhlIHBsdXJhbGl6ZWQgdmVyc2lvblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pOyAvL3Npbmd1bGFyaXplZCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hPbmU6ICh7IGNvbW1pdCB9LCB7IG1vZGVsLCBpZCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmQoeyB0eXBlOiBtb2RlbCwgaWQgfSkpLnRoZW4oZGF0YSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IG1vZGVsIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogYXN5bmMgKHsgY29tbWl0IH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IGF3YWl0IHRoaXMudXBkYXRlKHQgPT4gdC51cGRhdGVSZWNvcmQocmVjb3JkKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVsZXRlOiBhc3luYyAoeyBjb21taXQsIGRpc3BhdGNoIH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy51cGRhdGUodCA9PiB0LnJlbW92ZVJlY29yZChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YTogbnVsbCwgbW9kZWw6IGRhdGEudHlwZSB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0aW9ucy50cmFuc2Zvcm1Pck9wZXJhdGlvbnMpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeWluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5xdWVyeU9yRXhwcmVzc2lvbihxKTtcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNldDogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZGVsLmVuZHNXaXRoKFwiQ29sbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGUgYWxzbyBpbiBDb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2V0dGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVtgJHttb2RlbH1Db2xsZWN0aW9uYF0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVtgJHttb2RlbH1Db2xsZWN0aW9uYF0ucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BsaWNlIGRhdGEgaW4gb2RlciB0byBhY2hpZXZlIHVwZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXS5zcGxpY2UoZGF0YS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==