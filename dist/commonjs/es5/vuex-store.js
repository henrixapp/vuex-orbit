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
                _this.state[_this._schema.singularize(type)] = model;
                _this.state[_this._schema.pluralize(type)] = [];
            });
            //map fields
            _this.getters = {
                getField: function (state) {
                    return function (path) {
                        return path.split(/[.[\]]+/).reduce(function (prev, key) {
                            return prev[key];
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
                        dispatch("fetchAllOf", record.type);
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
                    _this.query(options.queryOrExpression).then(function (data) {
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
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        state[_this.schema.pluralize(model)].forEach(function (item) {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                            }
                        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiY3JlYXRlIiwiY29tbWl0IiwiZGlzcGF0Y2giLCJ0IiwicmVjb3JkIiwiZGF0YSIsImZldGNoQWxsT2YiLCJxIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJxdWVyeSIsImZldGNoUmVsYXRlZE9mIiwiZmV0Y2hPbmUiLCJpZCIsInR5cGUiLCJ1cGRhdGUiLCJkZWxldGUiLCJ1cGRhdGluZyIsIm9wdGlvbnMiLCJxdWVyeWluZyIsInNldCIsInN0YXRlIiwiaXRlbSIsInVwZGF0ZUZpZWxkIiwicGF0aCIsInZhbHVlIiwiYXJyYXkiLCJpbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCQSxZOzs7QUFDakIsYUFBQSxTQUFBLEdBQTJCO0FBQUEsWUFBZkUsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsU0FBQTs7QUFBQSxZQUFBLFFBQUEsMkJBQUEsSUFBQSxFQUN2QixPQUFBLElBQUEsQ0FBQSxJQUFBLEVBRHVCLFFBQ3ZCLENBRHVCLENBQUE7O0FBRXZCLGNBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFJQSxTQUFKLE1BQUEsRUFBcUI7QUFDakI7QUFDQSxrQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNBQyxtQkFBQUEsSUFBQUEsQ0FBWSxNQUFBLE9BQUEsQ0FBWkEsTUFBQUEsRUFBQUEsT0FBQUEsQ0FBeUMsVUFBQSxJQUFBLEVBQVE7QUFDN0Msb0JBQUlDLFFBQVFGLFNBQUFBLE1BQUFBLENBQUFBLFFBQUFBLENBQVosSUFBWUEsQ0FBWjtBQUNBLHNCQUFBLEtB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QUFBQTtBQU9IO0FBWFEsaUJBQUE7QUFhYkUsNkJBQWEsVUFBQSxLQUFBLEVBQUEsTUFBQSxFQUE0QjtBQUFBLHdCQUFsQkMsT0FBa0IsT0FBbEJBLElBQWtCO0FBQUEsd0JBQVpDLFFBQVksT0FBWkEsS0FBWTs7QUFDckM7QUFDQUQseUJBQUFBLEtBQUFBLENBQUFBLFNBQUFBLEVBQUFBLE1BQUFBLENBQTZCLFVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUE2QjtBQUN0RCw0QkFBSUUsTUFBQUEsTUFBQUEsS0FBaUJDLFFBQXJCLENBQUEsRUFBZ0M7QUFDNUI7QUFDQTNCLGlDQUFBQSxHQUFBQSxJQUFBQSxLQUFBQTtBQUNIO0FBQ0QsK0JBQU9BLEtBQVAsR0FBT0EsQ0FBUDtBQUxKd0IscUJBQUFBLEVBQUFBLEtBQUFBO0FBT0g7QUF0QlksYUFBakI7QUF3Qkg7QUE5RnNCLGVBQUEsS0FBQTtBQStGMUI7OztFQWhHa0M3QixlOztrQkFBbEJELFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG1vZGVsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4gcHJldltrZXldLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQuYWRkUmVjb3JkKHJlY29yZCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgcmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YTogcmVjb3JkLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHJlY29yZC50eXBlKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogcmVsYXRpb25zaGlwcyBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6ICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5wbHVyYWxpemUobW9kZWwpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKG1vZGVsKSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGU6ICh7IGNvbW1pdCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZXBsYWNlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0aW9ucy50cmFuc2Zvcm1Pck9wZXJhdGlvbnMpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRoZW5hYmxlKHN0b3JlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeWluZzogKHN0b3JlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkob3B0aW9ucy5xdWVyeU9yRXhwcmVzc2lvbikudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNldDogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmxhc3RJbmRleE9mKCdzJykgIT09IG1vZGVsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW3RoaXMuc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCldLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gZGF0YS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbGF0aW9uc2hpcHMgPSBkYXRhLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ua2V5cyA9IGRhdGEua2V5cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlRmllbGQ6IChzdGF0ZSwgeyBwYXRoLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGluIGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=