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
                        commit("set", { record: record, model: _this._schema.singularize(record.type) });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiY3JlYXRlIiwiY29tbWl0IiwiZGlzcGF0Y2giLCJ0IiwicmVjb3JkIiwiZmV0Y2hBbGxPZiIsInEiLCJkYXRhIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJxdWVyeSIsImZldGNoUmVsYXRlZE9mIiwiZmV0Y2hPbmUiLCJpZCIsInR5cGUiLCJ1cGRhdGUiLCJkZWxldGUiLCJzZXQiLCJzdGF0ZSIsIml0ZW0iLCJ1cGRhdGVGaWVsZCIsInBhdGgiLCJ2YWx1ZSIsImFycmF5IiwiaW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUNxQkEsWTs7O0FBQ2pCLGFBQUEsU0FBQSxHQUEyQjtBQUFBLFlBQWZFLFdBQWUsVUFBQSxNQUFBLEdBQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxNQUFBLFNBQUEsR0FBQSxVQUFBLENBQUEsQ0FBQSxHQUFKLEVBQUk7O0FBQUEsd0JBQUEsSUFBQSxFQUFBLFNBQUE7O0FBQUEsWUFBQSxRQUFBLDJCQUFBLElBQUEsRUFDdkIsT0FBQSxJQUFBLENBQUEsSUFBQSxFQUR1QixRQUN2QixDQUR1QixDQUFBOztBQUV2QixjQUFBLFVBQUEsR0FBQSxLQUFBO0FBQ0EsWUFBSUEsU0FBSixNQUFBLEVBQXFCO0FBQ2pCO0FBQ0Esa0JBQUEsS0FBQSxHQUFhLE1BQUEsS0FBQSxJQUFiLEVBQUE7QUFDQUMsbUJBQUFBLElBQUFBLENBQVksTUFBQSxPQUFBLENBQVpBLE1BQUFBLEVBQUFBLE9BQUFBLENBQXlDLFVBQUEsSUFBQSxFQUFRO0FBQzdDLG9CQUFJQyxRQUFRRixTQUFBQSxNQUFBQSxDQUFBQSxRQUFBQSxDQUFaLElBQVlBLENBQVo7QUFDQSxzQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNB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O0FBd0JIO0FBcEZzQixlQUFBLEtBQUE7QUFxRjFCOzs7RUF0RmtDMUIsZTs7a0JBQWxCRCxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0b3JlIGZyb20gJ0BvcmJpdC9zdG9yZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWdWV4U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2NoZW1hKSB7XG4gICAgICAgICAgICAvL2dlbmVyYXRlIHZ1ZXggc3RvcmVcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwgPSBzZXR0aW5ncy5zY2hlbWEuZ2V0TW9kZWwodHlwZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICAgICAgLy9hZGQgdG8gc3RhdGVcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZSh0eXBlKV0gPSBtb2RlbDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW3RoaXMuX3NjaGVtYS5wbHVyYWxpemUodHlwZSldID0gW107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vbWFwIGZpZWxkc1xuICAgICAgICAgICAgdGhpcy5nZXR0ZXJzID0ge1xuICAgICAgICAgICAgICAgIGdldEZpZWxkOiBzdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXRoID0+IHBhdGguc3BsaXQoL1suW1xcXV0rLykucmVkdWNlKChwcmV2LCBrZXkpID0+IHByZXZba2V5XSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBBZGQgZmV0Y2ggc2V0dGluZ3MgbGlrZSBqc29uIGFwaVxuICAgICAgICAgICAgICAgIGNyZWF0ZTogKHsgY29tbWl0LCBkaXNwYXRjaCB9LCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LmFkZFJlY29yZChyZWNvcmQpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIHJlY29yZC50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdChcInNldFwiLCB7IHJlY29yZCwgbW9kZWw6IHRoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZShyZWNvcmQudHlwZSkgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHJlbGF0aW9uc2hpcHMgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEucGx1cmFsaXplKG1vZGVsKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaEFsbFJlbGF0ZWRPZjogKHsgY29tbWl0IH0sIHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWxhdGVkUmVjb3JkcyhxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZChxdWVyeS5kYXRhLCBxdWVyeS5yZWxhdGlvbnNoaXApKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBxdWVyeS5yZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hPbmU6ICh7IGNvbW1pdCB9LCB7IG1vZGVsLCBpZCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmQoeyB0eXBlOiBtb2RlbCwgaWQgfSkpLnRoZW4oZGF0YSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IHRoaXMuX3NjaGVtYS5zaW5ndWxhcml6ZShtb2RlbCkgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVwbGFjZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiBjb21taXQoJ3NldCcsIHsgZGF0YSwgbW9kZWw6IGRhdGEudHlwZSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0ID0+IHQucmVtb3ZlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChcImZldGNoQWxsT2ZcIiwgZGF0YS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vVE9ETzogUmVsYXRlZFJlY29yZHMgdXBkYXRlIGFuZCBkZWxldGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm11dGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZXQ6IChzdGF0ZSwgeyBkYXRhLCBtb2RlbCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlW21vZGVsXSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5sYXN0SW5kZXhPZigncycpICE9PSBtb2RlbC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVt0aGlzLnNjaGVtYS5wbHVyYWxpemUobW9kZWwpXS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGRhdGEuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5yZWxhdGlvbnNoaXBzID0gZGF0YS5yZWxhdGlvbnNoaXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmtleXMgPSBkYXRhLmtleXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkOiAoc3RhdGUsIHsgcGF0aCwgdmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL3NldCBpbiBmaWVsZFxuICAgICAgICAgICAgICAgICAgICBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5LCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59Il19