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
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: function (_ref, model) {
                    var commit = _ref.commit;

                    _this.query(function (q) {
                        return q.findRecords(model);
                    }).then(function (data) {
                        commit('set', { data: data, model: _this._schema.pluralize(model) });
                    });
                },
                fetchAllRelatedOf: function (_ref2, query) {
                    var commit = _ref2.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecord(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchOne: function (_ref4, _ref5) {
                    var commit = _ref4.commit;
                    var model = _ref5.model,
                        id = _ref5.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: _this._schema.singularize(model) });
                    });
                },
                update: function (_ref6, data) {
                    var commit = _ref6.commit;

                    _this.update(function (t) {
                        return t.replaceRecord(data);
                    }).then(function () {
                        return commit('set', { data: data, model: data.type });
                    });
                },
                delete: function (_ref7, data) {
                    var commit = _ref7.commit,
                        dispatch = _ref7.dispatch;

                    _this.update(function (t) {
                        return t.removeRecord(data);
                    }).then(function () {
                        //update
                        dispatch("fetchAllOf", data.type);
                    });
                }
                //TODO: RelatedRecords update and delete
            };
            _this.mutations = {
                set: function (state, _ref8) {
                    var data = _ref8.data,
                        model = _ref8.model;

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
                updateField: function (state, _ref9) {
                    var path = _ref9.path,
                        value = _ref9.value;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiZmV0Y2hBbGxPZiIsImNvbW1pdCIsInEiLCJkYXRhIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJxdWVyeSIsImZldGNoUmVsYXRlZE9mIiwiZmV0Y2hPbmUiLCJpZCIsInR5cGUiLCJ1cGRhdGUiLCJ0IiwiZGVsZXRlIiwiZGlzcGF0Y2giLCJzZXQiLCJzdGF0ZSIsIml0ZW0iLCJ1cGRhdGVGaWVsZCIsInBhdGgiLCJ2YWx1ZSIsImFycmF5IiwiaW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUNxQkEsWTs7O0FBQ2pCLGFBQUEsU0FBQSxHQUEyQjtBQUFBLFlBQWZFLFdBQWUsVUFBQSxNQUFBLEdBQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxNQUFBLFNBQUEsR0FBQSxVQUFBLENBQUEsQ0FBQSxHQUFKLEVBQUk7O0FBQUEsd0JBQUEsSUFBQSxFQUFBLFNBQUE7O0FBQUEsWUFBQSxRQUFBLDJCQUFBLElBQUEsRUFDdkIsT0FBQSxJQUFBLENBQUEsSUFBQSxFQUR1QixRQUN2QixDQUR1QixDQUFBOztBQUV2QixjQUFBLFVBQUEsR0FBQSxLQUFBO0FBQ0EsWUFBSUEsU0FBSixNQUFBLEVBQXFCO0FBQ2pCO0FBQ0Esa0JBQUEsS0FBQSxHQUFhLE1BQUEsS0FBQSxJQUFiLEVBQUE7QUFDQUMsbUJBQUFBLElBQUFBLENBQVksTUFBQSxPQUFBLENBQVpBLE1BQUFBLEVBQUFBLE9BQUFBLENBQXlDLFVBQUEsSUFBQSxFQUFRO0FBQzdDLG9CQUFJQyxRQUFRRixTQUFBQSxNQUFBQSxDQUFBQSxRQUFBQSxDQUFaLElBQVlBLENBQVo7QUFDQSxzQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNBO0FBQ0Esc0JBQUEsS0FBQSxD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YixLQUFsQmEsVUFBQUE7QUFDQUEscUNBQUFBLGFBQUFBLEdBQXFCYixLQUFyQmEsYUFBQUE7QUFDQUEscUNBQUFBLElBQUFBLEdBQVliLEtBQVphLElBQUFBO0FBQ0g7QUFMTEQseUJBQUFBO0FBT0g7QUFYUSxpQkFBQTtBQWFiRSw2QkFBYSxVQUFBLEtBQUEsRUFBQSxLQUFBLEVBQTRCO0FBQUEsd0JBQWxCQyxPQUFrQixNQUFsQkEsSUFBa0I7QUFBQSx3QkFBWkMsUUFBWSxNQUFaQSxLQUFZOztBQUNyQztBQUNBRCx5QkFBQUEsS0FBQUEsQ0FBQUEsU0FBQUEsRUFBQUEsTUFBQUEsQ0FBNkIsVUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQTZCO0FBQ3RELDRCQUFJRSxNQUFBQSxNQUFBQSxLQUFpQkMsUUFBckIsQ0FBQSxFQUFnQztBQUM1QjtBQUNBdEIsaUNBQUFBLEdBQUFBLElBQUFBLEtBQUFBO0FBQ0g7QUFDRCwrQkFBT0EsS0FBUCxHQUFPQSxDQUFQO0FBTEptQixxQkFBQUEsRUFBQUEsS0FBQUE7QUFPSDtBQXRCWSxhQUFqQjtBQXdCSDtBQTdFc0IsZUFBQSxLQUFBO0FBOEUxQjs7O0VBL0VrQ3hCLGU7O2tCQUFsQkQsUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdG9yZSBmcm9tICdAb3JiaXQvc3RvcmUnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVnVleFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLm5hbWVzcGFjZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHNldHRpbmdzLnNjaGVtYSkge1xuICAgICAgICAgICAgLy9nZW5lcmF0ZSB2dWV4IHN0b3JlXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gc2V0dGluZ3Muc2NoZW1hLmdldE1vZGVsKHR5cGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgICAgIC8vYWRkIHRvIHN0YXRlXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUodHlwZSldID0gbW9kZWw7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEucGx1cmFsaXplKHR5cGUpXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiBwcmV2W2tleV0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAYXJndW1lbnQgbW9kZWw6IFRoZSBtb2RlbCBhcyBzaW5ndWxhcml6ZWQgbmFtZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZldGNoQWxsT2Y6ICh7IGNvbW1pdCB9LCBtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3Jkcyhtb2RlbCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5wbHVyYWxpemUobW9kZWwpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoQWxsUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmRzKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkKHF1ZXJ5LmRhdGEsIHF1ZXJ5LnJlbGF0aW9uc2hpcCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHF1ZXJ5LnJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKG1vZGVsKSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGU6ICh7IGNvbW1pdCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZXBsYWNlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlbGV0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZW1vdmVSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCBkYXRhLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBSZWxhdGVkUmVjb3JkcyB1cGRhdGUgYW5kIGRlbGV0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNldDogKHN0YXRlLCB7IGRhdGEsIG1vZGVsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVbbW9kZWxdID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmxhc3RJbmRleE9mKCdzJykgIT09IG1vZGVsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW3RoaXMuc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCldLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gZGF0YS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbGF0aW9uc2hpcHMgPSBkYXRhLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ua2V5cyA9IGRhdGEua2V5cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlRmllbGQ6IChzdGF0ZSwgeyBwYXRoLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IGluIGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=