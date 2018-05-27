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
                /*update: ({ commit }, data: Record) => {
                    this.update((t) => t.replaceRecord(data)).then(() =>
                        commit('set', { data, model: data.type })
                    )
                },*/
                delete: function (_ref7, data) {
                    var commit = _ref7.commit,
                        dispatch = _ref7.dispatch;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJzZXR0aW5ncyIsIk9iamVjdCIsIm1vZGVsIiwiZ2V0RmllbGQiLCJwcmV2IiwiY3JlYXRlIiwiY29tbWl0IiwiZGlzcGF0Y2giLCJ0IiwicmVjb3JkIiwiZGF0YSIsImZldGNoQWxsT2YiLCJxIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJxdWVyeSIsImZldGNoUmVsYXRlZE9mIiwiZmV0Y2hPbmUiLCJpZCIsInR5cGUiLCJkZWxldGUiLCJ1cGRhdGluZyIsIm9wdGlvbnMiLCJxdWVyeWluZyIsInNldCIsInN0YXRlIiwiaXRlbSIsInVwZGF0ZUZpZWxkIiwicGF0aCIsInZhbHVlIiwiYXJyYXkiLCJpbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCQSxZOzs7QUFDakIsYUFBQSxTQUFBLEdBQTJCO0FBQUEsWUFBZkUsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsU0FBQTs7QUFBQSxZQUFBLFFBQUEsMkJBQUEsSUFBQSxFQUN2QixPQUFBLElBQUEsQ0FBQSxJQUFBLEVBRHVCLFFBQ3ZCLENBRHVCLENBQUE7O0FBRXZCLGNBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFJQSxTQUFKLE1BQUEsRUFBcUI7QUFDakI7QUFDQSxrQkFBQSxLQUFBLEdBQWEsTUFBQSxLQUFBLElBQWIsRUFBQTtBQUNBQyxtQkFBQUEsSUFBQUEsQ0FBWSxNQUFBLE9BQUEsQ0FBWkEsTUFBQUEsRUFBQUEsT0FBQUEsQ0FBeUMsVUFBQSxJQUFBLEVBQVE7QUFDN0Msb0JBQUlDLFFBQVFGLFNBQUFBLE1BQUFBLENBQUFBLFFBQUFBLENBQVosSUFBWUEsQ0FBWjtBQUNBLHNCQUFBLEtBQUEsR0FBYSxN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TUFBQUEsS0FBaUJDLFFBQXJCLENBQUEsRUFBZ0M7QUFDNUI7QUFDQTFCLGlDQUFBQSxHQUFBQSxJQUFBQSxLQUFBQTtBQUNIO0FBQ0QsK0JBQU9BLEtBQVAsR0FBT0EsQ0FBUDtBQUxKdUIscUJBQUFBLEVBQUFBLEtBQUFBO0FBT0g7QUF0QlksYUFBakI7QUF3Qkg7QUFsR3NCLGVBQUEsS0FBQTtBQW1HMUI7OztFQXBHa0M1QixlOztrQkFBbEJELFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnQG9yYml0L3N0b3JlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZ1ZXhTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY2hlbWEpIHtcbiAgICAgICAgICAgIC8vZ2VuZXJhdGUgdnVleCBzdG9yZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEucGx1cmFsaXplKHR5cGUpXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiBwcmV2W2tleV0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICBjcmVhdGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5hZGRSZWNvcmQocmVjb3JkKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCByZWNvcmQudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoXCJzZXRcIiwgeyBkYXRhOiByZWNvcmQsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUocmVjb3JkLnR5cGUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiByZWxhdGlvbnNoaXBzIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBhcmd1bWVudCBtb2RlbDogVGhlIG1vZGVsIGFzIHNpbmd1bGFyaXplZCBuYW1lXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxPZjogKHsgY29tbWl0IH0sIG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmRzKG1vZGVsKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZHMocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoT25lOiAoeyBjb21taXQgfSwgeyBtb2RlbCwgaWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3JkKHsgdHlwZTogbW9kZWwsIGlkIH0pKS50aGVuKGRhdGEgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUobW9kZWwpIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YTogUmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCh0KSA9PiB0LnJlcGxhY2VSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9LCovXG4gICAgICAgICAgICAgICAgZGVsZXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlbW92ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIGRhdGEudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShvcHRpb25zLnRyYW5zZm9ybU9yT3BlcmF0aW9ucykudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLnF1ZXJ5T3JFeHByZXNzaW9uKHEpO1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL1RPRE86IFJlbGF0ZWRSZWNvcmRzIHVwZGF0ZSBhbmQgZGVsZXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==