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
                        commit("set", { data: data, model: _this._schema.singularize(data.type) });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiY3JlYXRlIiwiY29tbWl0IiwiZGlzcGF0Y2giLCJ0IiwicmVjb3JkIiwiZGF0YSIsImZldGNoQWxsT2YiLCJxIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJxdWVyeSIsImZldGNoUmVsYXRlZE9mIiwiZmV0Y2hPbmUiLCJpZCIsInR5cGUiLCJ1cGRhdGUiLCJkZWxldGUiLCJzZXQiLCJzdGF0ZSIsIml0ZW0iLCJ1cGRhdGVGaWVsZCIsInBhdGgiLCJ2YWx1ZSIsImFycmF5IiwiaW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUNxQkEsWTs7O0FBQ2pCLGFBQUEsU0FBQSxHQUEyQjtBQUFBLFlBQWZFLFdBQWUsVUFBQSxNQUFBLEdBQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxNQUFBLFNBQUEsR0FBQSxVQUFBLENBQUEsQ0FBQSxHQUFKLEVBQUk7O0FBQUEsd0JBQUEsSUFBQSxFQUFBLFNBQUE7O0FBQUEsWUFBQSxRQUFBLDJCQUFBLElBQUEsRUFDdkIsT0FBQSxJQUFBLENBQUEsSUFBQSxFQUR1QixRQUN2QixDQUR1QixDQUFBOztBQUV2QixjQUFBLFVBQUEsR0FBQSxLQUFBO0FBQ0EsWUFBSUEsU0FBSixNQUFBLEVBQXFCO0FBQ2pCO0FBQ0Esa0JBQUEsS0FBQSxHQUFhLE1BQUEsS0FBQSxJQUFiLEVBQUE7QUFDQUMsbUJBQUFBLElBQUFBLENBQVksTUFBQSxPQUFBLENBQVpBLE1BQUFBLEVBQUFBLE9BQUFBLENBQXlDLFVBQUEsSUFBQSxFQUFRO0FBQzdDLG9CQUFJQyxRQUFRRixTQUFBQSxNQUFBQSxDQUFBQSxRQUFBQSxDQUFaLElBQVlBLENBQVo7QUFDQSxzQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNB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QUF3Qkg7QUFwRnNCLGVBQUEsS0FBQTtBQXFGMUI7OztFQXRGa0MxQixlOztrQkFBbEJELFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG1vZGVsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4gcHJldltrZXldLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgY3JlYXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQuYWRkUmVjb3JkKHJlY29yZCkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgcmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KFwic2V0XCIsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZShkYXRhLnR5cGUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiByZWxhdGlvbnNoaXBzXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEucGx1cmFsaXplKG1vZGVsKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaEFsbFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkcyhxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZChxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hPbmU6ICh7IGNvbW1pdCB9LCB7IG1vZGVsLCBpZCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmQoeyB0eXBlOiBtb2RlbCwgaWQgfSkpLnRoZW4oZGF0YSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZShtb2RlbCkgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVwbGFjZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVtb3ZlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgZGF0YS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vVE9ETzogUmVsYXRlZFJlY29yZHMgdXBkYXRlIGFuZCBkZWxldGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm11dGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZXQ6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5sYXN0SW5kZXhPZigncycpICE9PSBtb2RlbC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVt0aGlzLnNjaGVtYS5wbHVyYWxpemUobW9kZWwpXS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGRhdGEuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5yZWxhdGlvbnNoaXBzID0gZGF0YS5yZWxhdGlvbnNoaXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmtleXMgPSBkYXRhLmtleXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkOiAoc3RhdGUsIHsgcGF0aCwgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL3NldCBpbiBmaWVsZFxuICAgICAgICAgICAgICAgICAgICBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5LCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59Il19